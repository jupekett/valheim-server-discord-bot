#!/bin/bash
envFile=../.env
exampleFile=../.env.example

declare -a secretPrefixes=(
    'TOKEN'
    'CHANNEL'
    'SERVER'
    'STEAM'
)

# clear example file
>$exampleFile

# Generate file `.env.example`
while IFS= read -r line; do
    isSecret=false

    # check if line is a secret variable
    for prefix in "${secretPrefixes[@]}"; do
        case $line in $prefix*)
            isSecret=true
            break
            ;;
        esac
    done

    if [ $isSecret == "true" ]; then
        IFS="="
        read -a splitLine <<<"$line"
        IFS=
        echo "Writing secret to example file:" $splitLine
        echo $splitLine'=' >>$exampleFile
    else
        echo "Writing plain line to example file:" $line
        echo $line >>$exampleFile
    fi

done <$envFile
