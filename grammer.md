1. 如何正确公式渲染
    在自己的md文件前面添加：
<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>

2. 如何插入图片
    ![图片名字](图片的相对地址)

3. 如何插入文档
    注意这个要使用绝对地址，比如:
    [1. 实变函数：可测函数](https://shepherdchinacan.github.io/blogs/real_valued_function/4.可测函数)