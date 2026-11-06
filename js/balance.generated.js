/* Generated from design/数值策划.xlsx. Run npm run balance; do not edit. */
(function (root) {
  const balance = {
  "revision": "e05b73881624798e",
  "releaseVersion": "0.8",
  "rules": {
    "market": {
      "pricePeriodDays": 3,
      "priceSteps": 7,
      "priceAmplitude": 0.012,
      "sellRate": 0.86,
      "restockDivisor": 12,
      "minimumRestock": 1
    },
    "loan": {
      "limit": 200,
      "dailyRate": 0.003,
      "termDays": 20
    },
    "rest": {
      "dailyCost": 2,
      "maxDays": 7,
      "relationshipGain": 1
    },
    "rescue": {
      "cashThreshold": 8,
      "reward": 12,
      "days": 1
    },
    "relationship": {
      "max": 100,
      "travelGain": 1,
      "storyGain": 3,
      "appleGain": 2,
      "trustThreshold": 40,
      "intimacyThreshold": 65
    },
    "events": {
      "dailyChance": 0.28,
      "rainForecastDays": 2,
      "travelerChance": 0.35,
      "tavernCost": 2,
      "harvestForecastExtraDays": 0,
      "festivalForecastExtraDays": 2
    }
  },
  "initial": {
    "money": 150,
    "day": 1,
    "relationship": 20,
    "wagon": {
      "cols": 8,
      "rows": 5,
      "maxWeight": 120
    },
    "inventory": {
      "fur": 8
    },
    "costBasis": {
      "fur": 136
    }
  },
  "calendar": {
    "daysPerMonth": 30,
    "monthsPerYear": 12,
    "epoch": {
      "year": 1,
      "month": 10,
      "day": 1
    }
  },
  "goods": [
    {
      "id": "wheat",
      "basePrice": 8,
      "weight": 3,
      "cargoW": 2,
      "cargoH": 2,
      "stackLimit": 4,
      "shelfLifeDays": null
    },
    {
      "id": "fur",
      "basePrice": 22,
      "weight": 2,
      "cargoW": 2,
      "cargoH": 1,
      "stackLimit": 4,
      "shelfLifeDays": null
    },
    {
      "id": "salt",
      "basePrice": 12,
      "weight": 2,
      "cargoW": 1,
      "cargoH": 2,
      "stackLimit": 6,
      "shelfLifeDays": null
    },
    {
      "id": "apple",
      "basePrice": 5,
      "weight": 1,
      "cargoW": 1,
      "cargoH": 1,
      "stackLimit": 6,
      "shelfLifeDays": 5
    },
    {
      "id": "pepper",
      "basePrice": 54,
      "weight": 1,
      "cargoW": 1,
      "cargoH": 1,
      "stackLimit": 10,
      "shelfLifeDays": null
    },
    {
      "id": "wine",
      "basePrice": 18,
      "weight": 3,
      "cargoW": 1,
      "cargoH": 2,
      "stackLimit": 3,
      "shelfLifeDays": null
    },
    {
      "id": "honey",
      "basePrice": 28,
      "weight": 1,
      "cargoW": 1,
      "cargoH": 1,
      "stackLimit": 4,
      "shelfLifeDays": null
    },
    {
      "id": "cheese",
      "basePrice": 10,
      "weight": 2,
      "cargoW": 1,
      "cargoH": 1,
      "stackLimit": 5,
      "shelfLifeDays": 4
    }
  ],
  "markets": {
    "pasloe": {
      "wheat": {
        "price": 6,
        "stock": 70
      },
      "honey": {
        "price": 23,
        "stock": 18
      },
      "cheese": {
        "price": 8,
        "stock": 32
      }
    },
    "yorentz": {
      "fur": {
        "price": 18,
        "stock": 26
      },
      "salt": {
        "price": 8,
        "stock": 60
      },
      "honey": {
        "price": 25,
        "stock": 20
      }
    },
    "pazzio": {
      "fur": {
        "price": 22.5,
        "stock": 18
      },
      "apple": {
        "price": 3,
        "stock": 80
      },
      "pepper": {
        "price": 44,
        "stock": 24
      },
      "wine": {
        "price": 15,
        "stock": 36
      }
    },
    "poroson": {
      "salt": {
        "price": 9.75,
        "stock": 42
      },
      "pepper": {
        "price": 55,
        "stock": 16
      },
      "wine": {
        "price": 17,
        "stock": 38
      },
      "cheese": {
        "price": 9.75,
        "stock": 34
      }
    },
    "ruvenheigen": {
      "wheat": {
        "price": 7.5,
        "stock": 52
      },
      "wine": {
        "price": 18.75,
        "stock": 30
      },
      "honey": {
        "price": 28.5,
        "stock": 20
      }
    }
  },
  "routes": [
    {
      "from": "pasloe",
      "to": "yorentz",
      "days": 2,
      "cost": 12
    },
    {
      "from": "pasloe",
      "to": "pazzio",
      "days": 3,
      "cost": 18
    },
    {
      "from": "yorentz",
      "to": "pazzio",
      "days": 4,
      "cost": 22.5
    },
    {
      "from": "pazzio",
      "to": "poroson",
      "days": 3,
      "cost": 21
    },
    {
      "from": "poroson",
      "to": "ruvenheigen",
      "days": 2,
      "cost": 15
    },
    {
      "from": "pazzio",
      "to": "ruvenheigen",
      "days": 5,
      "cost": 37.5
    }
  ],
  "purchaseNotices": [
    {
      "id": "pasloe-apples",
      "destination": "pasloe",
      "good": "apple",
      "quantity": 8,
      "unitPrice": 6.5,
      "initialPublishDay": 1,
      "listingDays": 8,
      "refreshDays": 4
    },
    {
      "id": "pasloe-wine",
      "destination": "pasloe",
      "good": "wine",
      "quantity": 6,
      "unitPrice": 19.75,
      "initialPublishDay": 1,
      "listingDays": 8,
      "refreshDays": 4
    },
    {
      "id": "yorentz-wheat",
      "destination": "yorentz",
      "good": "wheat",
      "quantity": 8,
      "unitPrice": 8.25,
      "initialPublishDay": 1,
      "listingDays": 6,
      "refreshDays": 4
    },
    {
      "id": "yorentz-apples",
      "destination": "yorentz",
      "good": "apple",
      "quantity": 10,
      "unitPrice": 6.5,
      "initialPublishDay": 1,
      "listingDays": 10,
      "refreshDays": 4
    },
    {
      "id": "pazzio-wheat",
      "destination": "pazzio",
      "good": "wheat",
      "quantity": 12,
      "unitPrice": 8.25,
      "initialPublishDay": 1,
      "listingDays": 9,
      "refreshDays": 4
    },
    {
      "id": "pazzio-cheese",
      "destination": "pazzio",
      "good": "cheese",
      "quantity": 10,
      "unitPrice": 10.75,
      "initialPublishDay": 1,
      "listingDays": 8,
      "refreshDays": 4
    },
    {
      "id": "poroson-apples",
      "destination": "poroson",
      "good": "apple",
      "quantity": 12,
      "unitPrice": 5.75,
      "initialPublishDay": 1,
      "listingDays": 8,
      "refreshDays": 4
    },
    {
      "id": "poroson-honey",
      "destination": "poroson",
      "good": "honey",
      "quantity": 8,
      "unitPrice": 31.5,
      "initialPublishDay": 1,
      "listingDays": 14,
      "refreshDays": 4
    },
    {
      "id": "ruvenheigen-pepper",
      "destination": "ruvenheigen",
      "good": "pepper",
      "quantity": 6,
      "unitPrice": 54.25,
      "initialPublishDay": 1,
      "listingDays": 12,
      "refreshDays": 4
    },
    {
      "id": "ruvenheigen-salt",
      "destination": "ruvenheigen",
      "good": "salt",
      "quantity": 10,
      "unitPrice": 12,
      "initialPublishDay": 1,
      "listingDays": 6,
      "refreshDays": 4
    }
  ],
  "story": [
    {
      "id": "promise",
      "saleQuantity": 0,
      "purchaseCompleted": 0,
      "money": 0
    },
    {
      "id": "fur-deal",
      "saleQuantity": 1,
      "purchaseCompleted": 0,
      "money": 10
    },
    {
      "id": "silver-resolution",
      "saleQuantity": 0,
      "purchaseCompleted": 1,
      "money": 35
    },
    {
      "id": "northbound",
      "saleQuantity": 1,
      "purchaseCompleted": 0,
      "money": 20
    }
  ],
  "worldEvents": [
    {
      "id": "rain",
      "minDays": 1,
      "maxDays": 3,
      "travelMultiplier": 2,
      "stockMultiplier": 1,
      "priceMultiplier": 1,
      "dailyConsumption": 0
    },
    {
      "id": "harvest",
      "minDays": 3,
      "maxDays": 5,
      "travelMultiplier": 1,
      "stockMultiplier": 2,
      "priceMultiplier": 0.7,
      "dailyConsumption": 0
    },
    {
      "id": "festival",
      "minDays": 3,
      "maxDays": 5,
      "travelMultiplier": 1,
      "stockMultiplier": 1,
      "priceMultiplier": 1.35,
      "dailyConsumption": 6
    }
  ]
};
  root.SW_BALANCE = balance;
  if (typeof module !== "undefined" && module.exports) module.exports = balance;
})(globalThis);
