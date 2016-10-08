FROM    centos:7

# Enable Extra Packages for Enterprise Linux (EPEL) for CentOS
RUN     yum install -y epel-release
# Install Node.js and npm
RUN     yum install -y nodejs npm

# Install app dependencies
COPY package.json /src/package.json

RUN cd /src; npm install --production

# For debugging use npm -ddd install --production

# Bundle app source
COPY . /src

EXPOSE  8080
CMD ["node", "/src/index.js"]

