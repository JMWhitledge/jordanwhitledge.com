import json,xlrd,datetime as dt,sys,statistics as st
D='data/'
# annual returns (Damodaran)
s=xlrd.open_workbook(D+'histretSP.xls').sheet_by_name('Nominal vs Real Data')
hdr=s.row_values(0); print(hdr[:6])
rows=[]
for r in range(1,s.nrows):
    v=s.row_values(r)
    if isinstance(v[0],float) and 1928<=v[0]<=2025:
        rows.append(dict(y=int(v[0]),st=v[1],bl=v[2],bd=v[3],inf=v[4]))
print(len(rows),rows[0],rows[-1])
# CAPE (December)
s=xlrd.open_workbook(D+'ie_data.xls').sheet_by_name('Data')
cape={}
for r in range(8,s.nrows):
    v=s.row_values(r)
    if isinstance(v[0],float) and isinstance(v[12],float):
        y=int(v[0]); m=round((v[0]-y)*100)
        if m==10 and False: pass
        if m==12 and 1928<=y<=2025: cape[y]=round(v[12],1)
    # Dec encodes as YYYY.12
print(cape[1928],cape[1999],cape[2025],len(cape))
for x in rows: x['cape']=cape.get(x['y'])
# daily closes -> bull/bear via 20% zigzag
j=json.load(open(D+'yahoo.json'))['chart']['result'][0]
ts=j['timestamp']; c=j['indicators']['quote'][0]['close']
px=[(dt.datetime.utcfromtimestamp(t).date(),p) for t,p in zip(ts,c) if p]
px=[x for x in px if x[0]<=dt.date(2025,12,31)]
print(len(px),px[0],px[-1])
turns=[]; mode='up'; ext=px[0]
for d,p in px:
    if mode=='up':
        if p>ext[1]: ext=(d,p)
        elif p<=ext[1]*0.8:
            turns.append(('peak',)+ext); mode='down'; ext=(d,p)
    else:
        if p<ext[1]: ext=(d,p)
        elif p>=ext[1]*1.2:
            # recovery of 20% off low confirms the low
            turns.append(('trough',)+ext); mode='up'; ext=(d,p)
# Merge bear-market rallies: a rally under 12 months that is followed by a lower low stays inside the bear.
close=dict(px)
pk=[t for t in turns if t[0]=='peak']; tr=[t for t in turns if t[0]=='trough']
if len(pk)>len(tr): tr.append(('trough',)+ext); open_end=True
bears=[[p[1],p[2],t[1],t[2]] for p,t in zip(pk,tr)]
i=0
while i<len(bears)-1:
    a,b=bears[i],bears[i+1]
    if (b[0]-a[2]).days<365 and b[3]<a[3]:
        bears[i]=[a[0],a[1],b[2],b[3]]; del bears[i+1]
    else: i+=1
# A lower close within 12 months that never produced a fresh 20% drop still marks the true low.
for i,b in enumerate(bears):
    lim=b[2]+dt.timedelta(days=365)
    nxt=bears[i+1][0] if i+1<len(bears) else px[-1][0]
    for d,p in px:
        if b[2]<d<=min(lim,nxt) and p<b[3]: b[2],b[3]=d,p
cyc=[]; prev=px[0]
def seg(kind,a,ap,b,bp): return dict(kind=kind,start=str(a),end=str(b),m=round((b-a).days/30.4375),chg=round(bp/ap-1,4))
for b in bears:
    cyc.append(seg('bull',prev[0],prev[1],b[0],b[1])); cyc.append(seg('bear',b[0],b[1],b[2],b[3])); prev=(b[2],b[3])
hi=max((x for x in px if x[0]>prev[0]),key=lambda x:x[1])
cyc.append(seg('bull',prev[0],prev[1],hi[0],hi[1]))
for x in cyc: print(x)
print('bears',sum(c['kind']=='bear' for c in cyc))
json.dump(dict(rows=rows,cycles=cyc),open('data/out.json','w'),separators=(',',':'))
# checks
def cagr(k,a,b):
    g=1
    for x in rows:
        if a<=x['y']<=b: g*=1+x[k]
    return g**(1/(b-a+1))-1,g
for k in('st','bd','bl','inf'):
    print(k,'1928-2024',round(cagr(k,1928,2024)[0]*100,2),'1928-2025',round(cagr(k,1928,2025)[0]*100,2),round(cagr(k,1928,2025)[1]*1000))
