import Algorithmia
import copy
import random, string

example_input = {
    "sublet": {
    "name": joe,
    "sqft": 1000,
    "price": {600,1000},
    "bedroom": 3.0,
    "coordinates": (75, 30)
    }

    "subleasers": [
        {
            "name": jim,
            "sqft": 1000,
            "price": 900,
            "bedroom": 3.0,
            "address": 2918 Ravensport Dr,
            "coordinates": (75, 30.001)
        },
        {
            "name": karen,
            "sqft": 975,
            "price": 1100,
            "bedroom": 4.0,
            "address": 2626 Salado Dr,
            "coordinates": (75.042, 30.001)
        }
        {
        "name": pam,
        "sqft" : 650,
        "price" : 625,
        "bedroom" : 2.0,
        "address": 4734 Burclare Ct,
        "coordinates" : (74.998, 30.007)
        }
    ],
    "scoring_weights": {
        "sqft": 1.0,
        "price range": 1.0,
        "bedroom": 1.0,
        "coordinates": 1.0
        "amenities": 0.3
    }
}

class AlgorithmError(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

def apply(input):
    # default weights for the scoring function
    default_weights = {
        "sqft": 1.0,
        "price": 1.0,
        "bedroom": 1.0,
        "coordinates": 1.0
         "amenities": 0.3
    }
    # overwrite the weights if given by user
    if "scoring_weights" in input:
        weights = overwriteWeights(default_weights, input["scoring_weights"])
    else:
        weights = default_weights


    scoring_list = {}
    for sublease in input["subleasers"]:
            score = scoring_function(weights, input["sublet"], sublease)
            if score >= 4:
                scoring_list[sublease["name"]] = score

    scoring_list.sort(reverse=True)



def overwriteWeights(default, new):
    rVal = default

    if "sqft" in new:
        rVal["sqft"] = float(new["sqft"])
    if "price" in new:
        rVal["price"] = float(new["price"])
    if "bedroom" in new:
        rVal["bedroom"] = float(new["bedroom"])
    if "coordinates" in new:
        rVal["coordinates"] = float(new["coordinates"])

    return rVal

def scoring_function(weights, sublet, sublease):

    ss = SnowballStemmer("english")
    score = 5.0

    call = sublease["sqft"] / sublet["sqft"]
    w1 = min(call, 1 / call)
    score = score * w1 * sqrt(1 - 0.37 * weights["sqft"])

    bounds = sublet["price"]
    l = bounds["low"]
    h = bounds["high"]
    if sublease["price"] > h:
        w2 = 2 * (sublease["price"] - h) / (l + h)
        score = score - w2 * sqrt(1 - 0.37 * weights["price"])

    if sublease["price"] < l:
        w2 = (l - sublease["price"]) / (l + h)
        score = score - w2 * sqrt(1 - 0.37 * weights["price"])

    if sublet["bedroom"] > sublease["bedroom"]
        score = score - 2 * (sublet["bedroom"] - sublease["bedroom"]) * weights["bedroom"]

    if sublet["bedroom"] < sublease["bedroom"]
        score = score - (sublease["bedroom"] - sublet["bedroom"]) * weights["bedroom"]

    # score proximity of the paired couple if coordinates exists for each person
    if "coordinates" in sublet and "coordinates" in sublease:
        coord_inputs = {
            "lat1": sublet["coordinates"]["lat"],
            "lon1": sublet["coordinates"]["long"],
            "lat2": sublease["coordinates"]["lat"],
            "lon2": sublease["coordinates"]["long"],
            "type": "miles"
            }
        distance = Algorithmia.algo("geo/GeoDistance").pipe(coord_inputs).result
        score -= distance * weights["coordinates"]



    return score
