pip install --upgrade stripe

import base64
import datetime
from google.cloud import bigquery
import pytz
import time
import stripe
import pandas as pd
import numpy as np
# google collab access to drive
from google.colab import drive
drive.mount ('/drive')


df = pd.DataFrame()
# api keys input
data = [['name', "api_key"], ['name', "api_key"]]
df_input = pd.DataFrame(data, columns=['stripe_account', 'stripe_api_key'])


df_combo = pd.DataFrame()
data_combo = [[1,2,3,4,5]]
df_combo =pd.DataFrame(data_combo, columns=["id", "customer","balance_transaction","calculated_statement_descriptor","created"])


for i in range(len(df_input)):
  charges = stripe.Charge.list(limit=100, api_key = df_input.stripe_api_key[i])
  lst = []
  for i in charges.auto_paging_iter():
      lst.extend([i])
  df = pd.DataFrame(lst)
  if len(df) > 0:
      df['created'] = pd.to_datetime(df['created'], unit='s')
  df_short = df[["id", "customer","balance_transaction","calculated_statement_descriptor","created"]]
  # df_short['stripe_account'] = df_input.stripe_account[i]
  frames = [df_combo, df_short]
  df_combo = pd.concat(frames)
  print(i)

df_combo.to_csv('/drive/My Drive/Stripe/combo_charges_short.csv')
