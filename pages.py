from otree_markets.pages import BaseMarketPage
from ._builtin import Page, WaitPage
class Market(BaseMarketPage):
    # def get_timeout_seconds(self):
    #     return self.group.get_remaining_time()

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds

    def vars_for_template(self):
        return {
            # 'round_num': self.subsession.config.get('round'),
            'g': self.subsession.get_g(),
            'k': self.subsession.get_k(),
            'm': self.subsession.get_m(),
            # 'y': self.subsession.get_y(),
            # 'q': self.subsession.get_q(),
            # 'expected_value': self.subsession.get_expected_value(),
            # 'default': self.subsession.get_default(),
        }

    def before_next_page(self):
        self.subsession.period_length = 99999
        self.subsession.save()
# class Wait(WaitPage):
    # wait_for_all_groups = True
    
class Results(BaseMarketPage):
    # after_all_players_arrive = 'get_data'

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds
    
    def vars_for_template(self):
        return {
            'g': self.subsession.get_g(),
            'k': self.subsession.get_k(),
            'm': self.subsession.get_m(),
            # 'y': self.subsession.get_y(),
            # 'q': self.subsession.get_q(),
            # 'expected_value': self.subsession.get_expected_value(),
            # 'default': self.subsession.get_default(),
        }

page_sequence = [Market, Results]
