#!/bin/sh -e

if [ "$CONTAINER_TEST" = true ]; then
    ansible-playbook docker-run.yml --tags "deploy" && \
    ansible-playbook docker-run.yml --tags "test"
else
    ansible-playbook docker-run.yml --tags "deploy" && \
    supervisord -n -c /etc/supervisord.conf
fi
