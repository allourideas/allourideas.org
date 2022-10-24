FROM phusion/passenger-ruby31:2.3.1
LABEL MAINTAINER="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.0'

ENV HOME /root
CMD ["/sbin/my_init"]

RUN apt-get clean
RUN apt-get update
RUN apt-get --assume-yes install mysql-client
RUN apt-get --assume-yes install sudo
RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default
ADD rails-env.conf /etc/nginx/main.d/rails-env.conf
ADD nginx.conf /etc/nginx/sites-enabled/oai_web_website.conf
ADD self_signed/bundle.pem /root/bundle.pem
ADD self_signed/private.pem /root/private.pem

RUN mkdir -p /etc/my_init.d
ADD setup_app.sh /etc/my_init.d/setup_app.sh

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR "/root"

RUN git clone https://github.com/CitizensFoundation/allourideas.org.git

WORKDIR "/root/allourideas.org"

EXPOSE 443