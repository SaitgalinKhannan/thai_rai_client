import React from 'react';

interface AvatarProps {
    src: string;
    alt: string;
    onClick: () => void
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, onClick }) => {
    return (
        <div style={{width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center"}} onClick={onClick}>
            <img style={{width: "100%", height: "100%", objectFit: "cover"}} src={src} alt={alt} />
        </div>
    );
};

export default Avatar;