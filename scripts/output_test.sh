#!/bin/bash

messages=(
    "Starting server. PRESS CTRL-C to exit"
    "12/15/2021 12:17:23: Valheim version:0.206.5

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:17:23: Get create world TestWorld

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:17:31: Load world TestWorld

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "=====================================================
TEST SEQUENCE: single login and logout
====================================================="
    "12/15/2021 12:20:04: Got handshake from client $MOCK_ID1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from $MOCK_CHARACTER1 : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket $MOCK_ID1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "=====================================================
TEST SEQUENCE: interweaved logins (join1-join2-character1-character2)
====================================================="
    "12/15/2021 12:20:04: Got handshake from client $MOCK_ID2

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:04: Got handshake from client $MOCK_ID3

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from $MOCK_CHARACTER2 : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from $MOCK_CHARACTER3 : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket $MOCK_ID2

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket $MOCK_ID3

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "=====================================================
TEST SEQUENCE: nested logins (join1-join2-character2-character1)
====================================================="
    "12/15/2021 12:20:04: Got handshake from client $MOCK_ID1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:04: Got handshake from client $MOCK_ID4

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from $MOCK_CHARACTER4 : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:37: Got character ZDOID from $MOCK_CHARACTER1 : -43114831:1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket $MOCK_ID1

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:20:43: Closing socket $MOCK_ID4

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
    "12/15/2021 12:24:15: ZNet Shutdown

(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 39)"
)
for ((i = 0; i < ${#messages[@]}; i++)); do
    echo -n "${messages[$i]}"
    sleep 1
done
