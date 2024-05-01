/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import {clientsClaim} from 'workbox-core';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

self.addEventListener('push', (event) => {
    if (event.data) {
        event.waitUntil(
            self.registration.showNotification(event.data.text(), {
                body: event.data.text(),
                icon: '/favicon.ico',
            }),
        );
    }
});

const saveSubscription = async (subscription: PushSubscription) => {
    const response = await fetch(`baseUrlForApi`, {
        method: 'ws',
        headers: {'Content-type': "application/json"},
        body: JSON.stringify(subscription)
    })

    return response.json()
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe()

    const response = await saveSubscription(subscription)
    console.log(response)
})

self.addEventListener("push", e => {
    self.registration.showNotification("Wohoo!!", {body: e.data?.text()})
})

export function sendNotify(text: string) {
    self.registration.showNotification("Wohoo!!")
}