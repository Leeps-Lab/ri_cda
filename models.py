from otree.api import (
    models, BaseConstants
)
from otree_markets import models as markets_models
from .configmanager import ConfigManager

import random

class Constants(BaseConstants):
    name_in_url = 'ri_cda'
    players_per_group = None
    num_rounds = 99

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

    }


class Subsession(markets_models.Subsession):
    g = models.IntegerField()
    k = models.FloatField()
    m = models.IntegerField()
    y = models.IntegerField()
    q = models.IntegerField()
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
        if self.round_number > self.config.num_rounds:
            return
        self.save()
        return super().creating_session()

    def get_g(self):
        if self.g is None:
            self.g = int(random.uniform(0, 100))
            self.save()
        return self.config.g

    def get_k(self):
        # if self.k is None:
        #     self.k = self.config.get('k')
        #     self.save()
        return self.config.k

    def get_m(self):
        if not self.m:
            self.m = int(random.uniform(0, 100))
            self.save()
        return self.m

    #Need for default
    def get_y(self):
        if not self.y:
            self.y = int(random.uniform(0, 100))
            self.save()
        return self.y

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

    def asset_endowment(self):
        return self.subsession.config.asset_endowment

    def cash_endowment(self):
        return self.subsession.config.cash_endowment * 100


    # def custom_export(self, players):
    #     # header row
    #     print(players.values_list())
    #     yield ['width', 'cost', 'm_low', 'm_high', 'low_val', 'high_val', 'bid_price', 'ask_price', 'bought', 'sold', 'round_payoff']
    #     for p in players:
    #         yield [p.width, p.bid_price, p.ask_price, p.bought, p.sold, p.round_payoff]

