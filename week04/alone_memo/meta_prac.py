import requests
from bs4 import BeautifulSoup

url = 'https://platum.kr/archives/120958'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get(url, headers=headers)
soup = BeautifulSoup(data.text, 'html.parser')

title = soup.select_one('meta[property="og:title"]:not([content=""])')['content']
image = soup.select_one('meta[property="og:image"]:not([content=""])')['content']
desc = soup.select_one('meta[property="og:description"]:not([content=""])')['content']
print(title)
print(image)
print(desc)