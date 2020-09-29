<?php
/*
 * Template Name: About
 */

get_header();
?>

<div class="aez-find-a-car-dropdown is-open">
	<h3 class="aez-find-a-car__heading aez-find-a-car__heading--white">Find A Car Worldwide</h3>
	<div class="fac_dropdown"><?php include_once('find-a-car-worldwide-form.php'); ?> </div>
</div>

<div class="aez-secondary-header" style="
    background-image: url(/wp-content/themes/twentysixteen-child/assets/cars_in_sunset.jpg);
">
	<div class="aez-gradient">
		<h1>About Advantage</h1>
		<h2>Smart Move</h2>
	</div>
</div>

<div class="aez-body">
	<p>
		You have a destination. Our mission at Advantage Rent A Car is to help you get there – quickly, efficiently and pleasantly.
	</p>
	<p>
		Wherever you’re going, we’re there – and we have a car for you: A new or next-to-new vehicle that’s ready when you are. No excuses, no surprises.
	</p>
	<p>
		Advantage Rent A Car is one of the largest car rental companies in the United States. We cater to business and leisure travelers with convenient locations in 44 of the nation’s top travel markets, including Orlando, Las Vegas, Los Angeles, Philadelphia and New York City. We’re proud to deliver superior service, choice and value for you – our customers.
	</p>
	<p>
		We are the GPS of your business trip, the vroom of your vacation.
	</p>
	<p>
		Here’s what other Advantage customers are saying about us:
	</p>
</div>

<?php include_once('includes/aez-quote.php'); ?>

<div class="aez-body">
	<p>
		If we made your rental experience enjoyable and provided exceptional service, we’d appreciate it you would <a href="https://www.facebook.com/AdvantageRAC/?fref=ts" target="_blank" class="-green">rate us here</a> or <a href="https://twitter.com/rentadvantage" target="_blank" class="-green">give us a shout out on social media</a>.
	</p>
	<p>
		Thank you for choosing or considering Advantage Rent A Car. We hope to see you again soon.
	</p>
</div>



<?php include_once('includes/aez-awards-promo.php'); ?>
<?php include_once('includes/return-to-top.php'); ?>
<script type='application/ld+json'> 
{
  "@context": "http://www.schema.org",
  "@type": "Corporation",
  "name": "Advantage Rent A Car",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "description": "Advantage Rent A Car offers a wide variety of new and almost new car rentals at the price and convenience you expect.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2003 McCoy Road",
    "addressLocality": "Orlando",
    "addressRegion": "Florida",
    "postalCode": "32809",
    "addressCountry": "United States"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }
}
</script>
<!--structure data markup for AutoRental-->
<script type='application/ld+json'> 
{
  "@context": "http://www.schema.org",
  "@type": "AutoRental",
  "name": "Advantage Rent A Car",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "image": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "priceRange": "1 to 100",
  "description": "Advantage Rent A Car offers a wide variety of new and almost new car rentals at the price and convenience you expect.",
  "telephone": "+1-800-777-5500",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2003 McCoy Road",
    "addressLocality": "Orlando",
    "addressRegion": "Florida",
    "postalCode": "32809",  
    "addressCountry": "United States"
  },
 
  "openingHours": "Mo, Tu, We, Th, Fr, Sa, Su 12:00-23:30",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }
}
</script>
<!--structure data markup for Organization-->
<script type='application/ld+json'> 
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.advantage.com/",
  "logo": "https://www.advantage.com/wp-content/uploads/2016/11/cropped-adv_logo.png",
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+1-800-777-5500",
    "contactType": "Customer Support"
  }]
}
</script>
<?php get_footer(); ?>
