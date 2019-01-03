# linux学习
##所有的<cszd>等于其里面的意思
### 命令
####  查看端口被谁占用
        1.lsof -i: <端口>
        2.netstat -tunlp|grep <端口>
        setp:
        【步骤一】lsof -i
            lsof -i 用以显示符合条件的进程情况，lsof(list open files)是一个列出当前系统打开文件的工具。以root用户来执行lsof -i命令
        【步骤二】lsof -i:端口号
            lsof -i:端口号，用于查看某一端口的占用情况，比如查看22号端口使用情况，lsof -i:22
        【步骤三】netstat -tunlp
            netstat -tunlp用于显示tcp，udp的端口和进程等相关情况
        【步骤四】netstat -tunlp|grep 端口号
            netstat -tunlp|grep 端口号，用于查看指定端口号的进程情况，如查看22端口的情况，netstat -tunlp|grep 22

####  查看 rpm
    rpm -qa 

#### 基本命令
    mv cp 移动 复制
    cp <filePath> <newFilePath>
    :set Number 显示行号
    :set nu! 取消显示行号
####
    https://blog.csdn.net/qiushisoftware/article/details/79520869
    make
    make install