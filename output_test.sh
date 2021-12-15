#!/bin/bash

messages=(
    "Starting server. PRESS CTRL-C to exit"
    "12/15/2021 12:17:23: Valheim version:0.206.5

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:17:23: Get create world TestWorld

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:17:31: Load world TestWorld

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:04: Got handshake from client 12345678901234567

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from TestCharacter : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket 12345678901234567

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:24:15: ZNet Shutdown

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
)
for ((i = 0; i < ${#messages[@]}; i++)); do
    echo -n "${messages[$i]}"
    sleep 1
done
