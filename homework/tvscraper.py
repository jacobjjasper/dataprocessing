#!/usr/bin/env python
# Name: Jacob Jasper
# Student number: 10650385
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

# import re for searching the tree for regular expressions
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'



def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    #create an empty list to put in lists of content of each serie
    series_contentlists = []

    # get all the content from 'Highest Rated TV Series With At Least 5000 Votes'
    #iterate over each item to get each serie_item
    for serie_item in dom.find_all('div', class_='lister-item-content'):

        #create an empty list for each serie_item[Title,Rating,Genre,Actors,Runtime]
        serie_content = []

        #find title, if none title then '-'
        serie_title = serie_item.h3.a.text
        if not serie_title:
            serie_title = '-'
        else:
            # append title to serie_content
            serie_content.append(serie_title)

            # find rating, if none rating then '-'
            serie_rating = serie_item.div.div.strong.text
            if not serie_rating:
                serie_rating = '-'

            # append rating to serie_content
            serie_content.append(serie_rating)


        # find genre, if none genre then '-'
        serie_genre = serie_item.p.find('span', class_='genre').text
        if not serie_genre:
            serie_genre = '-'
        else:
            serie_genre = serie_genre.strip()

            # append title to serie_content
            serie_content.append(serie_genre)

        #find actors, if none then '-'
        serie_actors = serie_item.find_all(class_= "", href = re.compile('/name/'))

        if not serie_actors:
            serie_actors = '-'
        else:

            # make empty list for actors
            list_actors = []

            #append each actor to list_actors
            for actor in serie_actors:
                list_actors.append(actor.text)

            #make string of all the actors
            str_actors = ', '
            serie_actors_str = str_actors.join(list_actors)

            # append actors to serie_content
            serie_content.append(serie_actors_str)

        #find rundtime, if none then '-'
        serie_runtime = serie_item.p.find('span', class_='runtime').text
        if not serie_runtime:
            serie_runtime = '-'
        else:

            #remove min from string
            serie_runtime = serie_runtime.strip(' min')

            #append runtime to serie_content
            serie_content.append(serie_runtime)

        #append serie_content to series_contentlists to make list of lists
        series_contentlists.append(serie_content)

    return series_contentlists


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for serie_list in tvseries:
        writer.writerow(serie_list)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
