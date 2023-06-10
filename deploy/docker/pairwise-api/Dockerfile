FROM phusion/passenger-ruby32:2.5.0
LABEL MAINTAINER="Robert Vidar Bjarnason <robert@citizens.is>"

RUN echo 'version 1.1'

ENV HOME /root
CMD ["/sbin/my_init"]

RUN apt-get clean
RUN apt-get update
RUN apt-get --assume-yes install mysql-client
RUN apt-get --assume-yes install sudo
RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default

ADD nginx.conf /etc/nginx/sites-enabled/aoi_api_website.conf
ADD rails-env.conf /etc/nginx/main.d/rails-env.conf
ADD passenger_maxmin.conf /etc/nginx/conf.d/passenger_maxmin.conf

RUN mkdir -p /etc/my_init.d
ADD setup_app.sh /etc/my_init.d/setup_app.sh

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 3072