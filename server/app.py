#!/usr/bin/env python

import shelve
import random
from subprocess import check_output
import flask
import json
import datetime
from flask import request
from flask import make_response
from os import environ

app = flask.Flask(__name__)
app.debug = True

db = shelve.open("shorten.db")
cookie = shelve.open("cookie.db")

@app.route('/')
def index():
    """Builds a template based on a GET request, with some default
    arguements"""

    username = ''
    username = request.cookies.get('username')

##    lat = request.headers['lat']
##    lon = request.headers['lon']

    useragent = request.headers['User-Agent']
    response = make_response(flask.render_template('index.html'))
    if (username is None) or (username == '') or (username == 'None'):
        keys = cookie.keys()
        n = 0
        while (n==0):
            username = str(random.randint(1000, 9999))
            if username in keys:
                n = 0
            else:
                n = 1
        app.logger.debug("Random number " + username)
        response.set_cookie('username', username)
        cookie[username] = '1'

    logline = json.dumps({'datetime': str(datetime.datetime.now()), 'Action': 'pageload', 'cookie': username, 'useragent': useragent})

    f = open("C:\Users\Dell\Backup\Dropbox\Google Drive\Haroon\MIMS14\Info253\server\log.txt", 'a')
    f.write(logline + "\n")
    f.close()

    #return flask.render_template('index.html')
    return response


###
# This function is not working properly because the Content-Type is not set.
# Set the correct MIME type to be able to view the image in your browser
##/
@app.route('/image')
def image():
    """Returns a PNG image of madlibs text"""
    relationship = request.args.get("relationship", "friend")
    name = request.args.get("name", "Jim")
    adjective = request.args.get("adjective", "fun")

##    resp = flask.make_response(
##            check_output(['convert', '-size', '600x400', 'xc:transparent',
##                '-font', '/usr/share/fonts/thai-scalable/Waree-BoldOblique.ttf',
##                '-fill', 'black', '-pointsize', '32', '-draw',
##                "text 10,30 'My %s %s said i253 was %s'" % (relationship, name, adjective),
##                'png:-']), 200);
##    # Comment in to set header below
##    resp.headers['Content-Type'] = 'image/png'

    str1 = request.headers['Accept']

    if str1.find("image") > -1:
        resp = flask.make_response(
        check_output(['convert', '-size', '600x400', 'xc:transparent',
                '-font', '/usr/share/fonts/thai-scalable/Waree-BoldOblique.ttf',
                '-fill', 'black', '-pointsize', '32', '-draw',
                "text 10,30 'My %s %s said i253 was %s'" % (relationship, name, adjective),
                'png:-']), 200);
            # Comment in to set header below
        resp.headers['Content-Type'] = 'image/png'
    elif str1.find("text") > -1:
    ##elif request.headers['Accept'] == 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8':
        resp = "My " + relationship + " " + name + " said i253 was " + adjective

    return resp


###
# Below is an example of a shortened URL
# We can set where /wiki redirects to with a PUT or POST command
# and when we GET /wiki it will redirect to the specified Location
##/
@app.route("/wiki", methods=['PUT', 'POST'])
def install_wiki_redirect():
    wikipedia = request.form.get('url', "http://en.wikipedia.org")
    db['wiki'] = wikipedia
    return "Stored wiki => " + wikipedia

@app.route("/wiki", methods=["GET"])
def redirect_wiki():
    destination = db.get('wiki', '/')
    app.logger.debug("Redirecting to " + destination)
    return flask.redirect(destination)


###
# Now we'd like to do this generally:
# <short> will match any word and put it into the variable =short= Your task is
# to store the POST information in =db=, and then later redirect a GET request
# for that same word to the URL provided.  If there is no association between a
# =short= word and a URL, then return a 404
##/
@app.route("/create", methods=['PUT', 'POST'])
def create():
    """Create an association of =short= with the POST arguement =url="""

    # Get the url and shortpath
    url = request.form.get('formurl')
    shorturl = request.form.get('formshortpath')

    # Get the list of keys stored in the shelve db
    list = db.keys()
    app.logger.debug((list))

    j=0
    msg=""
##    while j < len(list):
##        list1[j] = db[list[j]]
##        app.logger.debug((list1[j]))
        ##del db[list[j]]
    while j < len(list):
        # Check if the url is already present in the db.
        if db[list[j]] == url:
            shorturl = list[j]
            msg = "Shortpath already exists for the URL. Using the same shortpath"
            j = len(list)
            count=0
            if url in list:
                # Get count for the number of clicks
                count = db[str(url)]
            return flask.render_template('shorturl.html', longURL=url, shortPath=shorturl, message=msg, counts=str(count))
        j=j+1

    # Logic to generate a random word
    # Generate a random number (rand) between 6 and 9
    # Create a list with 26 alphabets
    # Run a while loop rand times
        #Generate a random number between 0 and 25
        #Take the alphabet in the randNumber index of alphList and append it to randomWord

    rand = random.randint(6, 9)
    alphList = map(chr, range(97, 123))
    # map, chr and range are built-in python functions. map applies chr to every integer in range 97 to 123.
    # chr converts a ASCII code in int to its character equivalent. This is same as the line commented below
    # This is same a having a list with alphabets a to z. alphList = ['a', 'b', 'c', .... , 'x', 'y', 'z']
    randomWord=""
    i=0
    while i<rand:
        randNumber = random.randint(0,25)
        randomWord = randomWord + alphList[randNumber]
        i=i+1

    # If the shortpath is not set in the form, then set the shortpath to the random word generated
    if shorturl == "":
        shorturl = randomWord

    # Associate shortpath and url in the db. Shortpath is the key and url is the value.
    db[str(shorturl)] = url

    # Create a new entry in the db with key as url and value 0.
    #This number will be the number of clicks. Each time a shortened url is clicked this value will be incremented.
    db[str(url)] = 0
    ##db.close()
    useragent = request.headers['User-Agent']
##    lat = request.headers['lat']
##    lon = request.headers['lon']
    lat = request.form.get("lat")
    lon = request.form.get("lon")
    logline = json.dumps({'datetime': str(datetime.datetime.now()), 'Action': 'saveURL', 'useragent': useragent, 'Latitude': lat, 'Longitude': lon})
    f = open("C:\Users\Dell\Backup\Dropbox\Google Drive\Haroon\MIMS14\Info253\server\log.txt", 'a')
    f.write(logline + "\n")
    f.close()
    return flask.render_template('shorturl.html', longURL=url, shortPath=shorturl, message=msg, counts='0')

    ##return flask.redirect("/")


@app.route("/<short>", methods=['GET'])
def redirect_short(short):
    """Redirect the request to the URL associated =short=, otherwise return 404
    NOT FOUND"""
    ##db = shelve.open("shorten.db")

    # Get the list of keys stored in the shelve db
    list = db.keys()
    app.logger.debug((list))

    destination=""

    # Check if the shortpath is present in the key list and get the associated url value
    if str(short) in list:
        destination = db.get(str(short))
        app.logger.debug(str(destination is None))

        # If the destination is empty, abort with 404
        if destination=="":
            flask.abort(404)
        else:
            app.logger.debug("Redirecting to " + destination)
            count=0

            # Check if the destination is present in the key list and get the value of count and increase it by 1.
            if destination in list:
                count=db[str(destination)]
            db[str(destination)]=count+1
            ##db.close()
            useragent = request.headers['User-Agent']
            lat = request.args.get("lat", "none")
            lon = request.args.get("lon", "none")
            logline = json.dumps({'datetime': str(datetime.datetime.now()), 'Action': 'redirect', 'useragent': useragent, 'Latitude': lat, 'Longitude': lon})
            f = open("C:\Users\Dell\Backup\Dropbox\Google Drive\Haroon\MIMS14\Info253\server\log.txt", 'a')
            f.write(logline + "\n")
            f.close()
            return flask.redirect(destination)
            #return flask.redirect("/")
    # If shortpath is not present in db, abort with 404
    else:
        flask.abort(404)

@app.route("/<short>", methods=['DELETE'])
def destroy(short):
    """Remove the association between =short= and it's URL"""
    raise NotImplementedError


if __name__ == "__main__":
    app.run(port=int(environ['FLASK_PORT']))
