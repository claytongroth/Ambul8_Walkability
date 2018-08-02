from flask import Flask, render_template, request, flash, redirect, url_for, jsonify
import json
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import pandas as pd
import mplleaflet
import ambul8Mod as amb
app = Flask(__name__, static_url_path = "/Flask", static_folder = "tmp")

app.config.update(dict(
    SECRET_KEY="powerful secretkey",
    WTF_CSRF_SECRET_KEY="a csrf secret key"
))
@app.route('/')
def my_form():
    return render_template('map.html')

@app.route('/<lat>+<lon>', methods=['GET', 'POST'])
def receive_coords():
    lat = request.args.get("lat", 0 , type = float)
    lng = request.args.get("lng", 0 , type = float)
    lat = float(lat)
    lng = float(lng)
    point = (lat,lng)
    isochroneGJ = amb.generateIsochrone(point)
    WS = (amb.generateWS(point))[0]
    amenityCount = (amb.generateWS(point))[1]
    amenityGJ = (amb.generateWS(point))[2]
    return (isochroneGJ=isochroneGJ, point=point, WS = WS, amenityCount = amenityCount, amenityGJ = amenityGJ)



if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
