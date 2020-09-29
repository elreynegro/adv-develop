<?php
/*
 * Template Name: Rental Policy
 */

get_header();
?>

<!-- start primary header -->
<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/scotland.png);
">
    <h1>Rental Policy</h1>
</div> <!-- end primary header -->

<div class="policy-dropdown">
    <span class="-blue">Select a rental policy</span>
    <div class="select-rental-policy">
        <img src="/wp-content/themes/twentysixteen-child/assets/map-marker.png" class="marker" alt="" />
        <select class="rental-dropdown">
            <option value="SC">Scotland</option>
            <option value="NI">Northern Ireland</option>
            <option value="EN">England</option>
            <option value="IR">Ireland</option>
            <option value="MEX">Mexico</option>
        </select>
    </div>
</div>

<div class="aez-body aez-body__rental">
    <h2 class="-dark-blue">Aberdeen Airport (ABZ) Rental Policy</h2>
    <h3 class="-blue aez-all-caps">ADDITIONAL DRIVERS</h3>
    <strong class="-grey">SERVICED BY EUROPCAR</strong>
    <p>
        Upon arrival, please proceed directly to the Europcar Counter.
    </p>
    <p>
        With the prior consent of Europcar, the car or van may be driven by other persons. All drivers must meet our standard qualifications as set out in these Terms and Conditions. A daily charge for each additional driver during the rental period may be levied. This charge will be indicated during the booking process.
    </p>
    <h3 class="-blue">AGE</h3>
    <p>
        The minimum rental age is 22. A young driver surcharge of £32.50 per day will apply to all drivers aged 22-24. Some vehicles and / or products will not be available to drivers under the age of 26 in certain locations. Please contact the local Branch directly if you are under the age of 26 for more details on their local renting policy. Minimum age for Prestige vehicles is 25 or 30 dependent on the vehicle.
    </p>
    <p>
        Drivers aged 22-24: A young driver surcharge of GBP32.50 per day will apply to all drivers aged 22-25. For rentals starting from Plymouth, Exeter, Taunton, Carmarthan, Pembroke, Aberystwyth and Llanelli the driving licence must have been held for at least 2 years prior to checkout.
    </p>
    <h3 class="-blue">AIRPORT PICKUP</h3>
    <p>
        Advantage Rent A Car has partnered with Europcar to provide service to our customers traveling abroad. Proceed to the Europcar counter for your vehicle.
    </p>
    <h3 class="-blue">CANCELLATION</h3>
    <strong class="-grey">Prepaid rental</strong>
    <p>
        Cancellations are free of charge up to 24 hours before the rental start time. For cancellations made less than 24 hours before the rental start time, the prepaid rental amount will be refunded minus a cancellation fee in the currency of the prepayment of €50, £45, 75 CHF, 65 US dollars or 400 Norwegian Kroner.
    </p>
    <p>
        No refunds will be given if you fail to collect the vehicle on the rental start date and have failed to notify us in writing in advance of this date. Once you have collected your vehicle no refund or partial refund is possible.
    </p>
    <strong class="-grey">Pay on arrival</strong>
    <p>
        If you have chosen to pay for the car or van when you come to collect it but your travel plans change then you can cancel your booking free of charge anytime up until two hours before your rental is due to start.
    </p>
    <p>
        If you lodge your credit or debit card details with us we will guarantee your car or van until close of business on the day your rental is due to start. However, if you do use this facility to guarantee your reservation and you either don't pick up the car or van on the day or don't give us two or more hours’ notice to cancel before the rental start time then you agree that we may charge a fee of £45 (or the equivalent in destination country currency) against that credit or debit card to compensate us for having held the car or van for you without any rental transaction ultimately taking place.
    </p>
</div>


<?php include_once('includes/aez-rides-promo.php'); ?>
<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
