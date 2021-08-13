FROM centos:7

# Add needed repos
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN curl --silent --location https://rpm.nodesource.com/setup_14.x | bash -

# Update and install packages
RUN yum update -y
RUN yum install -y epel-release git nodejs yarn
RUN npm install -g npm@latest
RUN npm install -g gatsby-cli@latest
RUN npm install -g yarn@latest

WORKDIR /data

CMD ["bash"]