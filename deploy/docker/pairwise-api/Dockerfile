FROM phusion/passenger-ruby31:2.3.1
LABEL MAINTAINER="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.0'

ENV HOME /root
CMD ["/sbin/my_init"]

RUN apt-get clean
RUN apt-get update
RUN apt-get --assume-yes install libyaml-dev
RUN apt-get --assume-yes install build-essential patch
RUN apt-get --assume-yes install ruby-dev zlib1g-dev liblzma-dev
RUN apt-get --assume-yes install ca-certificates
RUN apt-get --assume-yes install mysql-client
RUN apt-get --assume-yes install sudo
RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default
ADD nginx.conf /etc/nginx/sites-enabled/oav_website.conf
# Add the rails-env configuration file
ADD rails-env.conf /etc/nginx/main.d/rails-env.conf

RUN mkdir -p /etc/my_init.d
ADD setup_app.sh /etc/my_init.d/setup_app.sh

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/CitizensFoundation/pairwise-api
WORKDIR pairwise-api

EXPOSE 8883