import osmnx as ox
import networkx as nx
import sys
import pandas as pd
import csv
import matplotlib.cm as cm
import matplotlib.colors as colors

def getXY(pt):
    return (pt.y, pt.x)

lat1 = (40.758896)
lon1 = (-73.985130)
lat2 = (40.015654)
lon2 = (-105.279178)
# anton chico 35.2000506   -105.1422244
# manhattan 40.758896 -73.985130 (ought to be 100)
# squamish 49.701634 -123.155812
# sun prairie 43.181961 -89.235717
# Bufford WY  41.123688 (using to calibrate 0 WS)
# la crosse   43.801357   -91.239578
#omaha NE 41.257160, -95.995102
# Wicker Park Chicago 41.908802 -87.679596
# boulder CO 40.014984 -105.270546 ||| north boulder  40.047050 -105.272148 \\\ 40.032748 -105.272693 \\\ 40.024825 -105.271326 \\ 40.024480,-105.282036 \\ 40.015654,-105.279178

point1 = (lat1,lon1)
point2 = (lat2,lon2)

G = ox.core.graph_from_point(point1, distance = 500, network_type='walk')
G2 = ox.core.graph_from_point(point2, distance = 500, network_type='walk')

all_pois1 = ox.pois_from_point(point1, distance = 500)
all_pois2 = ox.pois_from_point(point2, distance = 500)
AmenityCount1 = all_pois1['amenity'].value_counts()
AmenityCount2 = all_pois2['amenity'].value_counts()

stats = ox.basic_stats(G, area=500)
stats2 = ox.basic_stats(G2, area=500)

POIshapes =  all_pois1['geometry'].centroid
POICoordslist = map(getXY, POIshapes)
#print POICoordslist
POIdistances = []
WeightedPOIDistances = []
for coordset in POICoordslist:
    orig_node = ox.get_nearest_node(G, (point1))
    dest_node = ox.get_nearest_node(G, (coordset))    # The issue has to be here because the individual lat lon list for POIs are accurate but the 'nodes' all display as if they are in the same place. Also its returning a distance of 688.8 m which isn't within 500m
    Dpoi = nx.shortest_path_length(G, orig_node, dest_node, weight='length')
    if Dpoi > 0:
        weight = 1/(Dpoi)
    else:
        weight = 1
    WeightedPOIDistances.append(weight * Dpoi)
    POIdistances.append(Dpoi)

POIshapes2 =  all_pois2['geometry'].centroid
POICoordslist2 = map(getXY, POIshapes2)
#print POICoordslist2
POIdistances2 = []
WeightedPOIDistances2 = []
for coordset in POICoordslist2:
    orig_node = ox.get_nearest_node(G, (point2))
    dest_node = ox.get_nearest_node(G, (coordset))    # The issue has to be here because the individual lat lon list for POIs are accurate but the 'nodes' all display as if they are in the same place. Also its returning a distance of 688.8 m which isn't within 500m
    Dpoi = nx.shortest_path_length(G, orig_node, dest_node, weight='length')
    if Dpoi > 0:
        weight = 1/(Dpoi)
    else:
        weight = 1
    WeightedPOIDistances2.append(weight * Dpoi)
    POIdistances2.append(Dpoi)


#exstats = ox.stats.extended_stats(G, connectivity =True, anc = True)

# POI Types, Population, crime
#Decay function for highest points within 5 min walk, 10, 15, https://www.walkscore.com/methodology.shtml

Walkability =  stats['street_density_km'] * .007 + stats['node_density_km'] *.30 + stats['street_segments_count']*.30 + (sum(WeightedPOIDistances)) * 1000

Walkability2 =  stats2['street_density_km'] * .007 + stats2['node_density_km'] *.30 + stats2['street_segments_count']*.30 + (sum(WeightedPOIDistances2)) * 1000

CGmax = 740239.4
CGmin = 1500

NewMax = 100
NewMin = 0

OldRange = (CGmax - CGmin)
NewRange = (NewMax - NewMin)
CGWalkscore = int(((Walkability - CGmin) * NewRange) / OldRange) + NewMin

CGWalkscore2 = int(((Walkability2 - CGmin) * NewRange) / OldRange) + NewMin

if Walkability > CGmax:
    CGWalkscore = 100
if Walkability2 > CGmax:
    CGWalkscore2 = 100
if Walkability < CGmin:
    CGWalkscore = 0
if Walkability2 < CGmin:
    CGWalkscore2 = 0
#print sum(WeightedPOIDistances)
#print POIdistances
#print sum(WeightedPOIDistances2)
#print POIdistances2

print CGWalkscore, "Our Walk Score for Manhattan"
print CGWalkscore2, "Our Walk Score for Downtown Boulder, CO"


print Walkability, "Raw Number Manhattan"
print Walkability2, "Raw Number Downtown Boulder, CO"

print AmenityCount1

#print stats['street_density_km'] * .009
#print stats2['street_density_km'] * .009
