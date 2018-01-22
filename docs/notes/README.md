

## Time Evolution
### 21 January 2018

So, whenever there is need for a visualization of sorts, I feel the
easiest way to create it at the moment is d3. While writing a conference
paper, I had to draw a tree, which was straightforward to an extend. I
glued together an example of force-layout-tree with the data I was
required to visualize, and got decent results.

A month or so down, I was having trouble finding an aesthetically and
functionally superior representation for another data I had to visualize
and present in the same paper. This time I went through the gallery and
decided a [collapsible indented
tree](https://bl.ocks.org/mbostock/1093025) will be good fit. After
finishing the required tweaking, with minimal knowledge of the framework
\- I'm fan enough to go ahead and dive in. So, here goes.


### 22 January 2018

I made an easy directory structure to work with github pages.

```
├── boilerplate
│   ├── custom.css
│   ├── driver.js
│   └── index.html
├── common
│   ├── common.css
│   └── conventional-margin.js
├── data
│   ├── flare.json
│   └── letter-frequency.tsv
├── docs
│   ├── constant.md
│   ├── exps.md
│   └── notes
│       └── README.md
├── exps
│   ├── bar-chart
│   │   ├── custom.css
│   │   ├── driver.js
│   │   └── index.html
│   └── multi-series-line
├── index.sh
├── LICENSE
└── README.md
```

Pretty simple. Each experiment is started by copying the boilerplate,
with some hacks to create a library-like with common and data.
`index.sh` creates a README which github pages seem to render nicely.


Started with a [bar-chart](https://bl.ocks.org/mbostock/3885304).  And
following it while looking at [Time Series Line
plot](https://bl.ocks.org/mbostock/3884955) came across [Margin
Conventions](https://bl.ocks.org/mbostock/3019563).






