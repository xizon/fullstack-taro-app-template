# 使用官方 PHP 7.3 镜像.
# https://hub.docker.com/_/php
FROM php:7.3-apache
 
# 将本地代码复制到容器内
# 复制单个文件可以写成 COPY index.php /var/www/html/
# 复制文件夹可以写成  COPY files/ /var/www/html/
COPY . /var/www/html/
 
# Apache 配置文件内使用 8080 端口
RUN sed -i 's/80/8080/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
 
# 将 PHP 配置为开发环境
# 如果您需要配置为生产环境，可以运行以下命令
# RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
# 参考：https://hub.docker.com/_/php#configuration
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"


# 启用 php 扩展(支持数据库、图像等)
RUN docker-php-ext-install mysqli

