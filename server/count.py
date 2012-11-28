import json
from mrjob.job import MRJob

class Count(MRJob):
    def mapper(self, line_no, line):
        jsonn = json.loads(line)
        for word in jsonn:
            yield word, 1
            yield jsonn[word], 1

    def reducer(self, word, count):
        total = sum(count)
        yield word, total

if __name__ == '__main__':
    Count.run()
