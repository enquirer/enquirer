FROM public.ecr.aws/v6d5q4a5/engineering/tooling/toolboxes/nodejs/development:1.0.39

ARG MKCERT_VERSION=1.4.4
ARG HELMFILE_VERSION=0.143.0
ARG DOCKER_COMPOSE_VERSION=2.23.0
ARG CLOUDSDK_VERSION=444.0.0
ARG YQ_VERSION=4.16.2

RUN chmod 1777 /tmp && \
    sudo apt-get update && \
    sudo apt-get install --yes default-jre && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash && \
    # chmod +x $HOME/.nvm/nvm.sh && \
    source ~/.bashrc && \
    echo -e 'export NVM_DIR="$HOME/.nvm" \n'\
    '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"\n'\
    '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.zshrc && \
    nvm install --alias=default 20.9.0 && \
    mkdir -p ~/.docker/cli-plugins/ && \
    curl -SL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-$(arch) -o ~/.docker/cli-plugins/docker-compose && \
    chmod +x ~/.docker/cli-plugins/docker-compose && \
    yarn global add --no-lockfile aws-cdk && \
    curl -L https://github.com/FiloSottile/mkcert/releases/download/v${MKCERT_VERSION}/mkcert-v${MKCERT_VERSION}-linux-$(dpkg --print-architecture) -o /usr/local/bin/mkcert && \
    chmod +x /usr/local/bin/mkcert && \
    curl -L https://github.com/roboll/helmfile/releases/download/v${HELMFILE_VERSION}/helmfile_linux_$(dpkg --print-architecture) -o /usr/local/bin/helmfile && \
    chmod +x /usr/local/bin/helmfile && \
    curl -L https://github.com/mozilla/sops/releases/download/v3.7.3/sops-v3.7.3.linux.$(dpkg --print-architecture) -o /usr/local/bin/sops && \
    chmod +x /usr/local/bin/sops && \
    curl -L https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz -o doctl.tar.gz && \
    tar xf doctl.tar.gz && sudo mv doctl /usr/local/bin && chmod +x /usr/local/bin/doctl && \
    curl -L https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-${CLOUDSDK_VERSION}-linux-arm.tar.gz -o gcloud.tar.gz && tar -xf gcloud.tar.gz && ./google-cloud-sdk/install.sh --quiet --usage-reporting false --command-completion true  --path-update true --rc-path ~/.zshrc && \
    curl -L https://github.com/derailed/k9s/releases/download/v0.27.4/k9s_Linux_arm64.tar.gz |  tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/k9s && \
    echo -e '\nalias develop="WATCH=true task build  -- "\n\
    alias engie="docker compose exec shell yarn ts-node-dev ./sources/entrypoint.ts"\n\
    ' >> ~/.zshrc
