from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, make_response
import json
import osmnx as ox
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import pandas as pd
import mplleaflet
import ambul8Mod as amb
app = Flask(__name__, static_url_path = "", static_folder = "static")

app.config.update(dict(
    SECRET_KEY="powerful secretkey",
    WTF_CSRF_SECRET_KEY="a csrf secret key"
))
@app.route('/')
def my_form():
    return render_template('mapRefined.html')

@app.route('/walkability/<lat>/<lng>', methods=['GET', 'POST'])
def receive_coords(lat, lng):
    lat = float(lat)
    lng = float(lng)
    point = (lat,lng)
    isochroneGJ = amb.generateIsochrone(point)
    WS = ((amb.generateWS(point))[0])
    amenityCount = ((amb.generateWS(point))[1])
    amenityGJ = ((amb.generateWS(point))[2])
    response = make_response(jsonify(isochroneGJ=isochroneGJ, WS=WS, amenityCount=json.loads(amenityCount), amenityGJ=json.loads(amenityGJ), point=point))
    response.headers['content-type'] = 'application/json'
    return response
    #return jsonify(isochroneGJ=isochroneGJ, WS=WS, amenityCount=amenityCount, amenityGJ=amenityGJ, point=point)


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
