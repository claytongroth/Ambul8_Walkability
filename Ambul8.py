from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
#from forms import RegistrationForm
import json
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import pandas as pd
import mplleaflet
app = Flask(__name__, static_url_path = "/Flask", static_folder = "tmp")

app.config.update(dict(
    SECRET_KEY="powerful secretkey",
    WTF_CSRF_SECRET_KEY="a csrf secret key"
))
@app.route('/')
def my_form():
    return render_template('map.html')

@app.route('/', methods=['GET', 'POST'])
def my_form_post():
    lat = (request.form['lat'])
    lng = (request.form['lng'])
    lat = float(lat)
    lng = float(lng)
    point = (lat,lng)
    G = ox.core.graph_from_point(point, distance = 500, network_type='walk')
    fig, ax = ox.plot_graph(G, show = False)
    GJp = mplleaflet.fig_to_geojson(fig=ax.figure)
    GJ = json.dumps(GJp)
    # GJ = ws.isochroneGeoJson(lat,lng)     # returns a geojson
    # WS = ws.walkScore(lat, lng)           # returns the WS
    # AM = ws.amentiesJson(lat, lng)        # Returns a geojson of amenties
    return render_template('map.html', lat1=lat, lng1=lng, GeJ=GJ, point=point)



if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
