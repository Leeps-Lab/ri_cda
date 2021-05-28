from otree.api import (
    models, BaseConstants
)
from otree_markets import models as markets_models
from .configmanager import ConfigManager
import csv
import random

class Constants(BaseConstants):
    name_in_url = 'ri_cda'
    players_per_group = None
    num_rounds = 24

    # the columns of the config CSV and their types
    # this dict is used by ConfigManager
    config_fields = {
        'round': int,
        'period_length': int,
        'asset_endowment': int,
        'cash_endowment': int,
        'allow_short': bool,
        'g': int,
        'k': float,
        'block_total': int,
        'participation_fee': float,
        'm': int,
        'y': int,
        'height': int,
    }


class Subsession(markets_models.Subsession):
    g = models.IntegerField()
    k = models.FloatField()
    m = models.IntegerField()
    y = models.IntegerField()
    height = models.IntegerField()
    # expected_value = models.FloatField()
    default = models.BooleanField()
    period_length = models.IntegerField()

    @property
    def config(self):
        config_addr = Constants.name_in_url + '/configs/' + self.session.config['config_file']
        return ConfigManager(config_addr, self.round_number, Constants.config_fields)

    def allow_short(self):
        return self.config.allow_short

    def creating_session(self):
        counter = 0
        filename = "ri_cda/configs/" + self.session.config['e_file']
        with open(filename, 'r') as csvfile:
            e_list = [row for row in csv.reader(csvfile)]
        for player in self.get_players():
            player.e = float(e_list[self.round_number][counter])
            counter = counter + 1
        if self.round_number > self.config.num_rounds:
            return
        return super().creating_session()

    def get_g(self):
        if self.g is None:
            self.g = self.config.g
            self.save()
        return self.config.g
    def get_height(self):
        if self.height is None:
            self.height = self.config.height
            self.save()
        return self.config.height
    def get_k(self):
        if self.k is None:
            self.k = self.config.k
            self.save()
        return self.config.k

    def get_m(self):
        if not self.m:
            self.m = self.config.m
            self.save()
        return self.config.m

    #Need for default
    def get_y(self):
        if not self.y:
            self.y = self.config.y
            self.save()
        return self.config.y

    def get_block_total(self):
        return self.config.block_total

    def get_participation(self):
        return self.config.participation_fee

    def get_round(self):
        return self.config.round

    #Default
    def get_default(self):
        if self.default is None:
            self.default = self.get_y() < self.get_g()
            self.save()
        return self.default

    # def get_expected_value(self):
    #     if self.expected_value is None:
    #         self.expected_value = (100 - self.g) + (self.g * self.m * 0.01)
    #         self.save()
    #     return self.expected_value

class Group(markets_models.Group):

    def period_length(self):
        return self.subsession.config.period_length

    def get_data(self):
        self.subsession.period_length = None
        self.subsession.save()

class Player(markets_models.Player):
    width = models.IntegerField(initial=100, blank=True)
    cost = models.FloatField(initial=0, blank=True)
    m_low = models.FloatField(initial=0, blank=True)
    m_high = models.FloatField(initial=100, blank=True)
    low_val = models.FloatField(initial=0, blank=True)
    high_val = models.FloatField(initial=100, blank=True)
    round_payoff = models.FloatField(initial=100, blank=True)
    bonds_held = models.IntegerField(initial = 0, blank = True)
    e = models.FloatField(initial = 0, blank = True)
    # allow negative settled
    def check_available(self, is_bid: bool, price: int, volume: int, asset_name: str):
        return True

    def asset_endowment(self):
        return self.subsession.config.asset_endowment

    def cash_endowment(self):
        return 0


    def custom_export(self, players):
        # header row
        print(players.values_list())
        yield ['width', 'cost', 'm_low', 'm_high', 'low_val', 'high_val', 'bid_price', 'bought', 'sold', 'round_payoff', 'bonds_held']
        for p in players:
            yield [p.width, p.bid_price, p.ask_price, p.bought, p.sold, p.round_payoff]
