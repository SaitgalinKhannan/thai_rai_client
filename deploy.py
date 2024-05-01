import os
import paramiko
import zipfile

server_ip="194.163.137.181"
server_username="root"
server_password="03042003"

# 1. Создание ZIP-архива
with zipfile.ZipFile('build.zip', 'w') as zip_file:
    for root, dirs, files in os.walk('build'):
        for file in files:
            zip_file.write(os.path.join(root, file))

# 2. Отправка ZIP-архива на сервер по SCP
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(server_ip, username=server_username, password=server_password)

scp = ssh.open_sftp()
scp.put('build.zip', '/tmp/build.zip')
scp.close()

# 3. Подключение к серверу по SSH с использованием пароля
ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(server_ip, username=server_username, password=server_password)

# 4. Распаковка ZIP-архива на сервере
stdin, stdout, stderr = ssh_client.exec_command('sudo unzip -o /tmp/build.zip -d /root/')
stdout.channel.recv_exit_status()
stdin, stdout, stderr = ssh_client.exec_command('sudo rm -f /tmp/build.zip')
stdout.channel.recv_exit_status()

# 5. Копирование содержимого папки build в /var/www/html
stdin, stdout, stderr = ssh_client.exec_command('sudo rm -rf /var/www/thairai/html')
stdout.channel.recv_exit_status()
stdin, stdout, stderr = ssh_client.exec_command('sudo mkdir /var/www/thairai/html')
stdout.channel.recv_exit_status()

stdin, stdout, stderr = ssh_client.exec_command('sudo cp -r /root/build/* /var/www/thairai/html/')
stdout.channel.recv_exit_status()
stdin, stdout, stderr = ssh_client.exec_command('sudo rm -rf /root/build')
stdout.channel.recv_exit_status()

# 6. Перезапуск Nginx
stdin, stdout, stderr = ssh_client.exec_command('sudo systemctl restart nginx')
stdout.channel.recv_exit_status()

ssh_client.close()
ssh.close()