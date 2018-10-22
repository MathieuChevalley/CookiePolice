import re
import traceback
import requests

analyticsPattern = r'google-analytics|' \
                   r'adobe-targeting'
browserReplayPattern = r'clicktale.net|' \
                       r'hotjar.com|' \
                       r'sessioncam.com'
pattern = r'Microsoft'

output = open('output.txt', 'w')

req = 'String is empty.'

try:
    html = "Invalid link."
    link = input("Enter website you would like to analyze:\n")
    req = requests.get(link).content.decode('utf-8')
    output.write(req)
    print("Analyzing " + link)
except Exception:
    print(html + " Please enter a valid link, and try again.")

# BASIC ANALYTICS
print("Searching for basic analytics services..")
try:
    analyticsPatternMatch = re.finditer(analyticsPattern, req)
    if analyticsPatternMatch:
        print("This website uses the following basic analytics service:")
        for match in analyticsPatternMatch:
            print(match.group())
except Exception:
    traceback.print_exc()

# BASIC ANALYTICS
print("Searching for session replay capabilities..")
try:
    analyticsPatternMatch = re.finditer(browserReplayPattern, req)
    if analyticsPatternMatch:
        print("This website uses the following session replay service:")
        for match in analyticsPatternMatch:
            print(match.group())
except Exception:
    traceback.print_exc()

print("Scan finished.")

output.close()