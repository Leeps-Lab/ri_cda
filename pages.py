from otree_markets.pages import BaseMarketPage
from ._builtin import Page, WaitPage
from .models import Constants
from .models import Group
class block_page(Page):
    def is_displayed(self):
        try:
            if self.subsession.get_block_total() == 1:
                return False
            else:
                return self.subsession.get_round() % self.subsession.get_block_total() == 1
        except:
            return False
    def vars_for_template(self):
        if self.subsession.get_block_total() == 1:
            block_num = int(self.subsession.get_round()/self.subsession.get_block_total())
        else:
            block_num = int(self.subsession.get_round()/self.subsession.get_block_total()) + 1
        participation = 0
        i = 0
        while (i < self.subsession.get_block_total()):
            participation += self.subsession.in_round(self.subsession.get_round() + i ).get_participation()
            i += 1
        return {
            'block_num': block_num,
            'participation': participation,
        }

class Start(Page):
    ##timeout_seconds = 60
    form_model = 'player'
    form_fields = ['width', 'cost', 'm_low', 'm_high', 'low_val', 'high_val']

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds

    def vars_for_template(self):

        return {
            'g': self.subsession.get_g(),
            'k': self.subsession.get_k(),
            'm': self.subsession.get_m(),
            'e': self.player.e,
            'height': self.subsession.get_height(),
            # 'y': self.subsession.get_y(),
            # 'q': self.subsession.get_q(),
            # 'expected_value': self.subsession.get_expected_value(),
        }
class Market(BaseMarketPage):

    # def get_timeout_seconds(self):
    #     return self.group.get_remaining_time()


    def before_next_page(self):
        if self.timeout_happened:
            self.player.save()

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds

    def vars_for_template(self):
        def before_next_page(self):
            self.player.save()

        return {
            'round_num': self.subsession.config.round,
            'g': self.subsession.get_g(),
            'm': self.subsession.get_m(),
            # 'y': self.subsession.get_y(),
            # 'q': self.subsession.get_q(),
            # 'expected_value': self.subsession.get_expected_value(),
        }
# class Wait(WaitPage):
#     wait_for_all_groups = True
class Results(BaseMarketPage):
    form_model = 'player'
    form_fields = ['round_payoff', 'bonds_held']

    def is_displayed(self):
        return self.round_number <= self.subsession.config.num_rounds

    def vars_for_template(self):
        # print(self.player.width, self.player.cost)
        return {
            'g': self.subsession.get_g(),
            'k': self.subsession.get_k(),
            'm': self.subsession.get_m(),
            'default': self.subsession.get_default(),
            'settled_assets': self.player.settled_assets.get('A'),
            'y': self.subsession.get_y(),
            # 'q': self.subsession.get_q(),
            # 'expected_value': self.subsession.get_expected_value(),
            # 'default': self.subsession.get_default(),
        }
class EndBlock(Page):

    def is_displayed(self):
        try:
            if self.subsession.get_block_total() == 1:
                return False
            else:
                return self.subsession.get_round() % self.subsession.get_block_total() == 0
        except:
            return False

    def vars_for_template(self):
        i = 0
        total_round_payoff = 0
        while (i < self.subsession.get_block_total()):
            total_round_payoff += round((self.player.in_round(self.subsession.get_round() - i ).round_payoff), 2)
            i += 1
            block_num = int(self.subsession.get_round()/self.subsession.get_block_total())
        participation = 0
        i = 0
        while (i < self.subsession.get_block_total()):
            participation += self.subsession.in_round(self.subsession.get_round() - i ).get_participation()
            i += 1
        return {
            'participation': participation,
            'block_num': block_num,
            'round_payoff': self.player.round_payoff,
            'total_round_payoff': total_round_payoff,
            'total_payoff': round(total_round_payoff - participation, 2),
            'round_4': round((self.player.in_round(self.subsession.get_round()).round_payoff), 2),
            'round_3': round((self.player.in_round(self.subsession.get_round() - 1).round_payoff), 2),
            'round_2': round((self.player.in_round(self.subsession.get_round() - 2).round_payoff), 2),
            'round_1': round((self.player.in_round(self.subsession.get_round() - 3).round_payoff), 2),
        }
class payment_page(Page):

    def is_displayed(self):
        try:
            return self.subsession.get_round() == 24
        except:
            return False

    def vars_for_template(self):
        payment_payoff = 0

        ##sum of total round payoffs
        participation_fee_total = 0

        ##sum of total participation fees
        for p in self.player.in_all_rounds():
            payment_payoff += p.round_payoff

        ##function to sum round payoffs
        for s in self.subsession.in_all_rounds():
            participation_fee_total += s.get_participation()

        ##function to sum total participation fees
        return {
            'player_id': self.player.id_in_group,
            'total_payoff': round((payment_payoff - participation_fee_total)*.10,2)
        }

page_sequence = [block_page, Start, Market, Results, EndBlock, payment_page]
