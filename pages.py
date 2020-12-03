from otree_markets.pages import BaseMarketPage

class Market(BaseMarketPage):

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds
        # return self.subsession.config is not None

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
page_sequence = [Market]
