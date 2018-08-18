import json
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import pandas as pd
import mplleaflet

#simple function for swapping order of lat lon in shapely geometries
def getXY(pt):
    return (pt.y, pt.x)

#creates a geojson from a pandas dataframe (GBOEING)
def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type':'FeatureCollection', 'features':[]}
    for _, row in df.iterrows():
        feature = {'type':'Feature',
                   'properties':{},
                   'geometry':{'type':'Point',
                               'coordinates':[]}}
        feature['geometry']['coordinates'] = [row[lon],row[lat]]
        for prop in properties:
            feature['properties'][prop] = row[prop]
        geojson['features'].append(feature)
    return geojson

# this function generates the blue/scale isochrone for the node network around the point in question
def generateIsochrone(point):
    network_type = 'walk'
    trip_times = [5, 10, 15, 20, 25] #in minutes
    travel_speed = 4.5 #walking speed in km/hour
    G = ox.core.graph_from_point(point, distance = 1000, network_type='walk')

    gdf_nodes = ox.graph_to_gdfs(G, edges=False)
    x, y = gdf_nodes['geometry'].unary_union.centroid.xy
    center_node = ox.get_nearest_node(G, (y[0], x[0]))

    meters_per_minute = travel_speed * 1000 / 60 #km per hour to m per minute
    for u, v, k, data in G.edges(data=True, keys=True):
        data['time'] = data['length'] / meters_per_minute

    iso_colors = ox.get_colors(n=len(trip_times), cmap='Blues', start=0.3, return_hex=True)

    # color the nodes
    node_colors = {}
    for trip_time, color in zip(sorted(trip_times, reverse=True), iso_colors):
        subgraph = nx.ego_graph(G, center_node, radius=trip_time, distance='time')
        for node in subgraph.nodes():
            node_colors[node] = color
    nc = [node_colors[node] if node in node_colors else 'none' for node in G.nodes()]
    ns = [20 if node in node_colors else 0 for node in G.nodes()]
    fig, ax = ox.plot_graph(G, fig_height=8, node_color=nc, node_size=ns, node_alpha=0.8, node_zorder=2, show = False)
    GJp = mplleaflet.fig_to_geojson(fig=ax.figure)
    return GJp

# this function:
# generates the Walk Score as per the equation we have built for the given location
# generates a geojson of all amenties with property "amenity" e.g. "school", "university"
# generates a count of all amenties as json
def generateWS(point):
    max = 740239.4
    min = 1500
    NewMax = 100
    NewMin = 0
    OldRange = (max - min)
    NewRange = (NewMax - NewMin)
    G = ox.core.graph_from_point(point, distance = 500, network_type='walk')
    all_pois = ox.pois_from_point(point, distance = 500)
    AmenityCount = all_pois['amenity'].value_counts()
    AmenityCount =  AmenityCount.to_json()
    #AmenityCount = str(AmenityCount)
    stats = ox.basic_stats(G, area=500)
    POIshapes =  all_pois['geometry'].centroid
    POICoordslist = map(getXY, POIshapes)
    WeightedPOIDistances = []
    for coordset in POICoordslist:
        orig_node = ox.get_nearest_node(G, (point))
        dest_node = ox.get_nearest_node(G, (coordset))    # The issue has to be here because the individual lat lon list for POIs are accurate but the 'nodes' all display as if they are in the same place. Also its returning a distance of 688.8 m which isn't within 500m
        Dpoi = nx.shortest_path_length(G, orig_node, dest_node, weight='length')
        if Dpoi > 0:
            weight = 1/(Dpoi)
        else:
            weight = 1
        WeightedPOIDistances.append(weight * Dpoi)
    rawWalkability =  stats['street_density_km'] * .007 + stats['node_density_km'] *.30 + stats['street_segments_count']*.30 + (sum(WeightedPOIDistances)) * 1000
    Walkscore = int(((rawWalkability - min) * NewRange) / OldRange) + NewMin
    if rawWalkability > max:
        Walkscore = 100
    if rawWalkability < min:
        Walkscore = 0
    poidata = []
    poidata = []
    for i, row in all_pois.iterrows():
        geom = getXY(row['geometry'].centroid)
        latitude = geom[0]
        longitude = geom[1]
        poidata.append([row["amenity"], latitude, longitude])
    col = ["amenity", "latitude", "longitude"]
    poi_df = pd.DataFrame(poidata, columns = col)
    poiGJ2 = poi_df.to_json(orient = 'index')
    #poiGJ = df_to_geojson(poi_df, col)
    #poiGJ = json.dumps(poiGJ)
    return Walkscore, AmenityCount, poiGJ2


#     test
#lat = (40.758896)
#lon = (-73.985130)
#point = (lat, lon)
#print (generateWS(point))
#print generateIsochrone(point)
