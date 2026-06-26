---
layout: post
title: "torch_dct_expand_to_rectangle"
date: 2024-09-01
categories: blogs
---

While training diffusion models, I needed to mollify Gaussian noise. I explored the `torch_dct` library, but it only supported DCT and IDCT on square matrices.

My use case involved meteorological fields with unequal height and width, where the longitudinal dimension is often about twice the latitudinal dimension. I extended the workflow to support DCT and IDCT on rectangular matrices so that it is easier to work with non-square atmospheric grids.

![torch_dct_expand_to_rectangle]({{ '/images/torch_dct_expand+to+rectangle.png' | relative_url }})

Project link: [github.com/sunmoumou1/torch_dct_expand_to_rectangle](https://github.com/sunmoumou1/torch_dct_expand_to_rectangle)
