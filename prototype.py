import re
import traceback
import requests

output = open('output.txt', 'w')

analyticsPattern = r'(google-analytics)|' \
                   r'(adobe-targeting)'
xSitePattern = r'(googletagmanager\.com)|' \
               r'(doubleclick\.net)'
xPlatformPattern = r'(hotjar\.com)|' \
                   r'(clicktale\.net)'
browserReplayPattern = r'(clicktale\.net)|' \
                       r'(hotjar\.com)|' \
                       r'(heapanalytics\.com)|' \
                       r'(fullstory\.com)|' \
                       r'(sessioncam\.com)|' \
                       r'(inspectlet\.com)'

req = 'String is empty.'
res = 'Link is invalid.'

try:
    link = input("Enter a URL link:")
    req = requests.get(link).content.decode('utf-8')
    print("Analyzing " + link)
    output.write(req)

    # BASIC ANALYTICS
    print("Searching for basic analytics services..")
    try:
        analyticsDict = {"SYS": 1}
        analyticsPatternMatch = re.finditer(analyticsPattern, req)
        if analyticsPatternMatch:
            res = "<h4>This website uses the following basic analytics service:</h4>"
            for match in analyticsPatternMatch:
                if match.group() in analyticsDict:
                    print(match.group() + " previously caught.")
                else:
                    print(match.group())
                    res = res + "<li>" + match.group() + "</li></br>"
                analyticsDict[match.group()] = 1
    except Exception:
        traceback.print_exc()

    # X SITE TRACKING
    print("Searching for cross site tracking services..")
    try:
        xSiteDict = {"SYS": 1}
        xSitePatternMatch = re.finditer(xSitePattern, req)
        if xSitePatternMatch:
            res = res + "<h4>This website uses the following cross site tracking service:</h4>"
            for match in xSitePatternMatch:
                if match.group() in xSiteDict:
                    print(match.group() + " previously caught.")
                else:
                    print(match.group())
                    res = res + "<li>" + match.group() + "</li></br>"
                xSiteDict[match.group()] = 1
    except Exception:
        traceback.print_exc()

    # X PLATFORM TRACKING
    print("Searching for cross-platform tracking services..")
    try:
        xPlatformDict = {"SYS": 1}
        xPlatformPatternMatch = re.finditer(xPlatformPattern, req)
        if xPlatformPatternMatch:
            res = res + "<h4>This website uses the following cross platform tracking service:</h4>"
            for match in xPlatformPatternMatch:
                if match.group() in xPlatformDict:
                    print(match.group() + " previously caught.")
                else:
                    print(match.group())
                    res = res + "<li>" + match.group() + "</li></br>"
                xPlatformDict[match.group()] = 1
    except Exception:
        traceback.print_exc()

    # BASIC ANALYTICS
    print("Searching for session replay capabilities..")
    try:
        sesDict = {"SYS": 1}
        sesPatternMatch = re.finditer(browserReplayPattern, req)
        if sesPatternMatch:
            res = res + "<h4>This website uses the following interaction tracking service:</h4>"
            for match in sesPatternMatch:
                if match.group() in sesDict:
                    print(match.group() + " previously caught.")
                else:
                    print(match.group())
                    res = res + "<li>" + match.group() + "</li></br>"
                sesDict[match.group()] = 1
    except Exception:
        traceback.print_exc()

    print("Scan finished.")
except Exception:
    print("Please enter a valid link, and try again.")
    traceback.print_exc()

output.close()