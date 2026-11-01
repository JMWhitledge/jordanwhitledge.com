import re,os
R='/Users/jordanwhitledge/Downloads/JMW_Website_Build_Package/'
src=open(R+'resources.html').read()
d=open('data/out.json').read()
head=src[:src.index('</nav>')+7]
head=re.sub(r'<script type="application/ld\+json">.*?</script>\n','',head,flags=re.S)
head=head.replace('<title>Resources | Jordan M. Whitledge</title>','<title>The Long View | Jordan M. Whitledge</title>')
desc='What $1,000 did across 98 years of U.S. markets: stocks, bonds, bills, inflation, valuations, and every bull and bear market since 1928.'
head=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="%s">\n<meta name="robots" content="noindex">'%desc,head)
head=head.replace('<meta property="og:title" content="Resources | Jordan M. Whitledge">','<meta property="og:title" content="The Long View | Jordan M. Whitledge">')
head=re.sub(r'<meta property="og:description" content="[^"]*">','<meta property="og:description" content="%s">'%desc,head)
head=head.replace('https://www.jordanwhitledge.com/resources"','https://www.jordanwhitledge.com/long-view"')
head=head.replace('</head>',open('page/lv.css').read()+'</head>')
tail=src[src.index('<footer>'):]
tail=tail.replace('</body>',open('page/lv.js').read().replace('/*DATA*/',d)+'</body>')
open(R+'long-view.html','w').write(head+open('page/lv_body.html').read()+'\n'+tail)
print(len(head),os.path.getsize(R+'long-view.html'))
