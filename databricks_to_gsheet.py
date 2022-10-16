
# query the data
df = spark.sql(
"""
SELECT * 
FROM metrics
WHERE 1=1 
    AND day < DATE(now())
ORDER BY day DESC
"""
)

import pandas as pd

import gspread
from gspread_dataframe import set_with_dataframe


def generate_data(df_in) -> pd.DataFrame:
    """
    df_in: it's a pyspark.sql.dataframe.DataFrame
    """

    return df_in.toPandas()


def get_creds(service_acc_path) -> gspread.Client:
    creds = gspread.service_account(
        filename=service_acc_path,
        scopes=[
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    )

    return creds


def insert_data(
    creds: gspread.Client, data: pd.DataFrame, worksheet_name="daily"
):
    _ = creds.open_by_url(
        "https://docs.google.com/spreadsheets/d/file_id"
    )
    worksheet = _.worksheet(worksheet_name)
    worksheet.clear()

    set_with_dataframe(
        worksheet=worksheet,
        dataframe=data,
    )
    return


insert_data(
    creds=get_creds(service_acc_path="path_to_service_account_credentials.json"),
    data=generate_data(df),
)
