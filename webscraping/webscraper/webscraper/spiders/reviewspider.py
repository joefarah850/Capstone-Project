import scrapy


class ReviewspiderSpider(scrapy.Spider):
    name = "reviewspider"
    allowed_domains = ["flatreviews.com"]
    start_urls = ["https://flatreviews.com/dubai/top-areas"]

    def parse(self, response):
        reviews = response.css('div.cell.auto')
        i = 0 
        
        for rev in reviews:
            url = response.xpath(f'/html/body/main/section[2]/div/div[3]/a[{i+1}]/@href').get()
            
            if url == None:
                continue
            else:
                i += 1
            
            if i == 19:
                break
            
            yield {
                "url" : url
                
            
            }
