filename="blog.tar.gz"
cd docs/.vuepress && tar -zvcf $filename dist && rm -rf dist && mv $filename ./../../