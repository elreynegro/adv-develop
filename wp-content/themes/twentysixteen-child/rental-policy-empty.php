<?php
/*
 * Template Name: Rental Policy (Empty)
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

<span class="-grey rental-empty">(No Location Selected)</span>


<?php include_once('includes/aez-rides-promo.php'); ?>
<?php include_once('includes/return-to-top.php'); ?>
<?php get_footer(); ?>
