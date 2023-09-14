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

        return item