# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class WebscraperPipeline:
    def process_item(self, item, spider):

        adapter = ItemAdapter(item)
        
        ## Price --> convert to float
        value = adapter.get('price')
        adapter['price'] = float(value.replace('\xa0', '').replace('AED', '').replace(',', ''))

        ## Size --> convert to float
        value = adapter.get('size')
        adapter['size'] = float(value.split()[0])

        ## Num Rooms --> convert to int
        value = adapter.get('num_rooms')
        if value is not None:
            adapter['num_rooms'] = int(eval(value.strip()))
        else:
            adapter['num_rooms'] = 1

        ## Num Bathrooms --> convert to int
        value = adapter.get('num_bathrooms')
        if value is not None:
            adapter['num_bathrooms'] = int(eval(value.strip()))
        else:
            adapter['num_bathrooms'] = 1

        ## Fix title
        value = adapter.get('title')
        adapter['title'] = value.split(',')[0] + ', ' + value.split(',')[-1].split("sq.m. ")[-1]

        return item
    
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

class SaveToMySQLPipeline:
    def __init__(self):
        self.conn = mysql.connector.connect(
            host = os.getenv('DB_HOST'),
            user = os.getenv('DB_USER'),
            password = os.getenv('DB_PASSWORD'),
            database = 'properties'
        )

        self.cur = self.conn.cursor()

        ## Create table if it doesn't exist

        self.cur.execute("""
        CREATE TABLE IF NOT EXISTS property_info(
            id INT NOT NULL AUTO_INCREMENT,
            url VARCHAR(255),
            title VARCHAR(255),
            city VARCHAR(255),
            region VARCHAR(255),
            type VARCHAR(255),
            num_rooms INT,
            num_bathrooms INT,
            size FLOAT,
            price FLOAT,
            PRIMARY KEY (id)
        )
        """)

    def process_item(self, item, spider):

        ## Define insert statement
        self.cur.execute(""" INSERT INTO property_info (
            url, 
            title, 
            city, 
            region, 
            type,
            num_rooms,
            num_bathrooms,
            size,
            price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) """, (
                item['url'],
                item['title'],
                item['city'],
                item['region'],
                item['type'],
                item['num_rooms'],
                item['num_bathrooms'],
                item['size'],
                item['price']
            )
        )

        ## Commit changes
        self.conn.commit()

        return item
    
    def close_spider(self, spider):

        self.cur.close()
        self.conn.close()

