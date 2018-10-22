from flask import Flask, request #import main Flask class and request object
import re
import traceback
import requests

app = Flask(__name__) #create the Flask app

@app.route('/form', methods=['GET', 'POST']) #allow both GET and POST requests
def form():
    if request.method == 'POST':  #this block is only entered when the form is submitted
        site = request.form.get('site')
        response = analyse(site)
        return '''{}'''.format(response)

    return '''<form method="POST">
                  <h3>CookiePolice v.0.1</h3>
                  <p>Enter the url link to the website you would like to analyse.</br></p>
                  Site: <input type="text" name="site"><input type="submit" value="Submit">
              </form>'''

def analyse(link):
    output = open('output.txt', 'w')

    analyticsPattern = r'google-analytics|' \
                       r'adobe-targeting'
    browserReplayPattern = r'clicktale.net|' \
                           r'hotjar.com|' \
                           r'heapanalytics.com|' \
                           r'fullstory.com|' \
                           r'sessioncam.com'

    req = 'String is empty.'
    res = 'Link is invalid.'

    try:
        req = requests.get(link).content.decode('utf-8')
        print("Analyzing " + link)
        output.write(req)

        # BASIC ANALYTICS
        print("Searching for basic analytics services..")
        try:
            analyticsPatternMatch = re.finditer(analyticsPattern, req)
            if analyticsPatternMatch:
                res = "<h4>This website uses the following basic analytics service:</h4>"
                for match in analyticsPatternMatch:
                    res = res + "<li>" + match.group() + "</li></br>"
                    print(match.group())
        except Exception:
            traceback.print_exc()

        # BASIC ANALYTICS
        print("Searching for session replay capabilities..")
        try:
            analyticsPatternMatch = re.finditer(browserReplayPattern, req)
            if analyticsPatternMatch:
                res = res + "<h4>This website uses the following session replay service:</h4>"
                for match in analyticsPatternMatch:
                    res = res + "<li>" + match.group() + "</li></br>"
                    print(match.group())
        except Exception:
            traceback.print_exc()

        print("Scan finished.")
    except Exception:
        print("Please enter a valid link, and try again.")
        traceback.print_exc()

    output.close()

    return res

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=80) #run app in debug mode on port 80
