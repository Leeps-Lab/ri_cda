# otree_single_asset_market

This experiment is a single-asset CDA market implemented using [oTree Markets](https://github.com/Leeps-Lab/otree_markets). To install, follow the installation instructions for oTree Markets [here](https://github.com/Leeps-Lab/otree_markets/wiki/Installation). Then clone this repo into your oTree project folder and add the following session config dict to `SESSION_CONFIGS` in settings.py:

```python
 dict(
        name='ri_cda',
        display_name='Rational Inattention - Continuous Double Auction',
        num_demo_participants=2,
        app_sequence=['ri_cda'],
        config_file='demo.csv',
    )
```

Config files are located in the "configs" directory. They're CSVs where each row configures a round of trading. The columns are described below.

* `period_length` - the length of the round in seconds
* `asset_endowment` - the amount of asset each player is endowed with
* `cash_endowment` - the amount of cash each player is endowed with
* `allow_short` - either "true" or "false". if true, players are allowed to have negative cash and asset holdings
