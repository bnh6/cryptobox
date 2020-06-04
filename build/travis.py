import requests
import time
import sys, os

host = 'https://api.travis-ci.org'
repoId = 28512573
sleetime = 20

headers = {
    "Accept": "application/vnd.travis-ci.2.1+json",
    "Travis-API-Version": "3",
    "Authorization": "token {0}".format(os.environ["TRAVIS_TOKEN"])
}

print ("triggering travis on branch "+os.environ["BRANCH"])

requests.packages.urllib3.disable_warnings() 

def doRequest(method, url, data=None):
    response = requests.request(method, host+url, json=data, headers=headers, verify=False)
    if (response.status_code > 299):
        print ("something went wrong ", response.status_code)
        if response.status_code == 429: 
            print ("Travis request limit exceeded, wait a few minutes and try again ...")
        print (response.content) # can leak data 
        sys.exit(os.EX_SOFTWARE)
    return response.json()

def requestBuild():
    requestId =  doRequest("POST", "/repo/bnh6%2Fcryptobox/requests",
        data={"request": {"branch":os.environ["BRANCH"]}}
    )["request"]["id"]
    print ("requestId = ", requestId)
    return requestId

def getBuildId(requestId):
    while True:
        buildJson = doRequest("GET","/repo/{0}/request/{1}".format (repoId, requestId))
        if buildJson["state"] == "pending":time.sleep(sleetime)
        else: return buildJson["builds"][0]["id"] # TODO check if build failed

def getBuild(buildId):
    buildJson  =  doRequest("GET", "/build/{0}".format (buildId))
    print ("buildId = ", buildId, ", state = ",buildJson["state"]) 
    return buildJson["state"], buildJson["finished_at"], [job["id"] for job in  buildJson["jobs"]]

def getLogs(jobId): 
    return doRequest("GET", "/job/{0}/log".format (jobId))["content"]

buildId = getBuildId(requestBuild())
jobIds = []
while True:
    state, finishedAt, jobIds = getBuild(buildId)
    if (finishedAt != None): break;
    else: time.sleep(10)


for jobId in jobIds:
    print ('='*74, 
    '\n\nTravis JobID={0} \n\navailable at https://www.travis-ci.org/github/bnh6/cryptobox/jobs/{0} \n\n{1}'
    .format(jobId, getLogs(jobId)), 
    flush=True)


print ("RESULT = ",state)
if state == "passed": sys.exit(os.EX_OK)
sys.exit(os.EX_SOFTWARE)