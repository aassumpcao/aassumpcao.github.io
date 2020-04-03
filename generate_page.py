# import main libraries
import re
import json
from bs4 import BeautifulSoup
from html import unescape

# import custom libraries
from webpage import template

# load template and convert to html
def initialize_template():
    return BeautifulSoup(template.template, 'lxml')

# define function to make menu item active
def make_active(page, soup):
    page = re.compile(page)
    for child in soup.find('div', {'class': 'topnav'}).find_all('a'):
        if re.search(page, child.text):
            child.attrs['class'] = 'active'

# define function to save html page
def save_html(page, soup):
    with open(f'{page}.html', 'w') as file:
        file.write(str(soup))

# define function to insert content into main div
def save_home():

    # call first methods
    soup = initialize_template()
    make_active('home', soup)

    # load about and create content
    with open('pagetext/about.txt', 'r') as file:
        paragraphs = file.read().splitlines()

    # create tags and fill them with text
    h2 = soup.new_tag(name='h2', id='about', style='margin-top: 10px')
    h2.string = 'about'
    soup.find('div', {'class': 'main'}).insert(0, h2)
    p = soup.new_tag(name='p')
    for i, para in enumerate(paragraphs):
        p = soup.new_tag(name='p')
        p.string = para
        soup.find('div', {'class': 'main'}).insert(i+1, p)

    # find last position and insert image
    position = len(soup.find('div', {'class': 'main'}))
    img = soup.new_tag(
        name='img', src='files/logo.png', align='left',
        style='max-width:100%;height:auto;'
    )
    soup.find('div', {'class': 'main'}).insert(7, img)

    # save page
    save_html('index', soup)

# define function to insert content into main div
def save_cv():

    # call first methods
    soup = initialize_template()
    make_active('cv', soup)

    # create iframe for cv
    iframe = soup.new_tag(
        name='iframe', src='files/cv.pdf', style='max-width:100%;height:auto;'
    )

    # insert and save
    soup.find('div', {'class': 'main'}).insert(0, iframe)
    save_html('cv', soup)

# define function to insert content into main div
def save_publications():

    # define function to insert content into main div
    def load_publications():
        with open('pagetext/publications.json', 'r') as file:
            publications = json.load(file)
        return publications

    # define function to split pubs
    def split_sort_publications(publications, _type):
        return sorted(
            [entry for entry in publications if entry['type'] == _type],
            key=lambda entry: entry['year'],
            reverse=True
        )

    # initialize template
    soup = initialize_template()
    make_active('publications', soup)

    # insert script to display boxes with details and links
    script = soup.new_tag(name='script')
    script.string = '''
        function openBox(position) {
          var x = document.getElementsByClassName("details");
          if (x[position].style.display == "none") {
            x[position].style.display = "inline-block";
          } else {
            x[position].style.display = "none";
          }
        }
    '''
    soup.body.insert_before(script)

    # define types of papers being searched
    types = ['working-papers', 'in-preparation', 'peer-reviewed']

    # load publications
    pubs = load_publications()

    # split publications
    wp = split_sort_publications(pubs, types[0])
    prep = split_sort_publications(pubs, types[1])
    pub = split_sort_publications(pubs, types[2])

    # create all three tags of publications
    h2 = []
    for i, _type in enumerate(types):
        tag = soup.new_tag(name='h2', id=_type, style='margin-top:10px')
        tag.string = re.sub(r'-', ' ', _type)
        h2 += [tag]

    # define function to create unpublished item
    def generate_unpublished(num, type, title, year, abstract, link):
        return f'''
            <p class='title'>
              <button onclick='openBox({num})'>details</button>
              &nbsp; {title} ({year})
              &nbsp; <a href='{link}' target='_blank'>find here.</a>
            </p>

            <p class='details' id='details_{num}' style='display: none;'>
              <b>
                abstract:
              </b>
                {abstract}
            </p>
        '''

    # fill in each type of unpublished item
    wp_html, prep_html = [], []
    for i, paper in enumerate(wp + prep):
        item = generate_unpublished(i, **paper)
        item = BeautifulSoup(unescape(item), 'lxml')
        for x, paragraph in enumerate(item.find_all('p')):
            if i < len(wp):
                wp_html += [paragraph]
            else:
                prep_html += [paragraph]

    # define function to create published item
    def generate_published(type, authors, title, journal, vol, year, link):
        if not isinstance(authors, list):
            authors = authors
        else:
            authors = ', '.join(authors)
        return f'''
            <p class='title'>
              <button onclick='window.open("{link}","_blank")'>link</button>
                &nbsp; {authors}. {title}. <i>{journal}</i>, vol.{vol}, {year}.
            </p>
        '''

    # fill in each type of published item
    pub_html = []
    for paper in pub:
        item = generate_published(**paper)
        item = re.sub(r'(Andre Assumpcao)', r'<strong>\1</strong>', item)
        item = BeautifulSoup(unescape(item), 'lxml')
        for paragraph in item.find_all('p'):
            pub_html += [paragraph]

    # append element by element
    for i, heading in enumerate(h2):
        soup.find('div', {'class': 'main'}).append(heading)
        if i == 0:
            for paper in wp_html:
                soup.find('div', {'class': 'main'}).append(paper)
        elif i == 1:
            for paper in prep_html:
                soup.find('div', {'class': 'main'}).append(paper)
        else:
            for paper in pub_html:
                soup.find('div', {'class': 'main'}).append(paper)

    # save to file
    save_html('publications', soup)

# define function to insert content into main div
def save_software():

    # initialize template
    soup = initialize_template()
    make_active('software', soup)

    # search programs
    with open('pagetext/software.json', 'r') as file:
        software = json.load(file)

    # create list with program languages
    types = [program['type'] for program in software]
    software = sorted(software, key=lambda entry: entry['year'], reverse=True)
    headings = {}
    headings = {program for program in types if program not in headings}

    # create list of html tags which will be inserted into main div
    tags, paras = [], []

    # create h2 tags
    for head in headings:
        tag = soup.new_tag(name='h2', id=head, style='margin-top:10px')
        tag.string = head
        tags += [tag]

    # construct p, u, and button tags
    for program in software:
        para = soup.new_tag(name='p', id=program['type'])
        button = soup.new_tag(
            name='button',
            onclick=f'window.open("{program["link"]}", "_blank")'
        )
        button.string = f'{program["title"]} ({program["year"]}):'
        para.string = '&nbsp;' + program['summary']
        para.insert(0, button)
        paras += [para]

    # insert tags into main div
    for tag in tags:
        soup.find('div', {'class': 'main'}).append(tag)
        for para in paras:
            if re.search(tag['id'], para['id']):
                soup.find('div', {'class': 'main'}).append(para)

    # save to file
    save_html('software', soup.prettify(formatter=None))

# define function to insert content into main div
def save_data():

    # initialize template
    soup = initialize_template()
    make_active('data', soup)

    # search programs
    with open('pagetext/data.json', 'r') as file:
        data = json.load(file)

    # create list with program languages
    types = [dataset['type'] for dataset in data]
    headings = {}
    headings = {dataset for dataset in types if dataset not in headings}

    # create list of html tags which will be inserted into main div
    tags, paras = [], []

    # create h2 tags
    for head in headings:
        tag = soup.new_tag(name='h2', id=head, style='margin-top:10px')
        tag.string = head
        tags += [tag]

    # construct p, u, and button tags
    for dataset in data:
        para = soup.new_tag(name='p', id=dataset['type'])
        button = soup.new_tag(
            name='button',
            onclick=f'window.open("{dataset["link"]}", "_blank")'
        )
        button.string = 'link'
        para.string = '&nbsp;' + f'{dataset["title"]}'
        para.insert(0, button)
        paras += [para]

    # insert tags into main div
    for tag in tags:
        soup.find('div', {'class': 'main'}).append(tag)
        for para in paras:
            if re.search(tag['id'], para['id']):
                soup.find('div', {'class': 'main'}).append(para)

    # save to file
    save_html('data', soup.prettify(formatter=None))

# execute if main
def main():

    # execute function for each page
    save_home()
    save_cv()
    save_publications()
    save_software()
    save_data()

# execution block
if __name__ == '__main__':
    main()
