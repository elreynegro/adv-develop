<?php
/*
 *	Template Name: Reservation Completed
 */

if (count($_POST)) {
    // process the POST data
    // your code here- so for example to log a user in, register a new account..
    // ...make a payment...etc

    // redirect to the same page without the POST data, including any GET info you
    // want, you could add a clause to detect whether processing the post data has 
    // been successful or not, depending on your needs

    $get_info = "?status=success";

    // if not using rewrite
    // header("Location: ".$_SERVER['PHP_SELF'].$get_info);

    // if using apache rewrite
    header("Location: ".$_SERVER['REQUEST_URI'].$get_info);
    exit();
}

get_header();


// Start the loop.
while ( have_posts() ) : the_post();

    // Include the page content template.
    get_template_part( 'template-parts/content', 'page' );

    // If comments are open or we have at least one comment, load up the comment template.
    if ( comments_open() || get_comments_number() ) {
        comments_template();
    }

    // End of the loop.
endwhile;

include_once('includes/return-to-top.php');
get_footer();

/*
<div id="primary">

    <div class="aez-confirmation">
        <div class="aez-confirmation__heading">Your reservation has been confirmed!</div>
        <div class="aez-confirmation-number">
            <div class="aez-confirmation-number__heading">Confirmation Number:</div>
            <div class="aez-confirmation-number__number">WAD00E2CAAAD</div>
            <div class="aez-confirmation-number__message">A copy of your reservation has been sent to your email.</div>
        </div>
    </div>

    <main id="main" role="main">
        <div class="aez-reservation">
            <div class="aez-print-row">
                <a href="javascript:window.print();" class="aez-print-text">Print <i class="fa fa-print aez-print-icon"></i>
            </div></a>

            <div class="aez-selected-car">
                <a href="#">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                </a>
                <div class="aez-vehicle-img">
                    <img src="http://i.imgur.com/N0gbPLD.png" alt="car picture">
                </div>
                <div class="aez-vehicle-content">
                    <h3>Selected:</h3>
                    <h1>Economy (ECAR)</h1>
                    <div class="aez-mini-details">
                        <span>
                            <i class="fa fa-road" aria-hidden="true"></i>
                            <p>Auto</p>
                        </span>
                        <span>
                            <i class="fa fa-tachometer" aria-hidden="true"></i>
                            <p>37mpg</p>
                        </span>
                        <span>
                            <i class="fa fa-users" aria-hidden="true"></i>
                            <p>5</p>
                        </span>
                        <span>
                            <i class="fa fa-suitcase" aria-hidden="true"></i>
                            <p>2</p>
                        </span>
                    </div>
                </div>
            </div> <!-- end aez-selected-car-container -->

            <div class="aez-info-block-container">
                <h3>Itinerary</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Pick Up</h4>
                        <h5 class="aez-info-date">Monday - September 15, 2016</h5>
                        <h5 class="aez-info-time">12:00 am</h5>
                        <p class="aez-info-text">
                            Orlando International Airport (MCO)<br>
                            1 Airport Blvd Suite A<br>
                            Orlando, FL 32827
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Drop Off</h4>
                        <h5 class="aez-info-date">Friday - September 21, 2016</h5>
                        <h5 class="aez-info-time">12:00 am</h5>
                        <p class="aez-info-text">
                            Orlando International Airport (MCO)<br>
                            1 Airport Blvd Suite A<br>
                            Orlando, FL 32827
                        </p>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->

            <div class="aez-list aez-list--summary aez-list--completed">
                <h3>Fees &amp; Options</h3>
                <ul>
                    <div class="list-items">
                        <li>Line Item - Cost 1</li>
                        <li><span class="aez-sub">US</span> $25.00<span class="aez-sub -blue">/day</span></li>
                    </div>
                    <div class="list-items">
                        <li>Line Item - Cost 2</li>
                        <li><span class="aez-sub">US</span> $25.00</li>
                    </div>
                    <div class="list-items">
                        <li>Line Item - Cost 3</li>
                        <li><span class="aez-sub">US</span> $25.00</li>
                    </div>
                    <div class="list-items">
                        <li>Line Item - Cost 4</li>
                        <li><span class="aez-sub">US</span> $25.00</li>
                    </div>
                    <div class="list-items total">
                        <li>Total</li>
                        <li>US $100.00</li>
                    </div>
                </ul>
            </div> <!-- end aez-list -->

            <div class="aez-info-block-container">
                <h3>Payment</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Credit Card</h4>
                        <p class="aez-info-text">
                            Name: John Doe<br>
                            VISA: Ends in 1234<br>
                            Exp. Date: 00/00
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Billing Address</h4>
                        <p class="aez-info-text">
                            Orlando International Airport (MCO)<br>
                            1 Airport Blvd Suite A<br>
                            Orlando, FL 32827
                        </p>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->

            <div class="aez-info-block-container renter-info">
                <h3>Renter Information</h3>
                <div class="aez-info-block">
                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Profile</h4>
                        <p class="aez-info-text">
                            Name: John Doe<br>
                            DOB: 01/01/01<br>
                            Address: 000 First Avenue<br>
                            Raritan, NJ 080808-0808, USA
                        </p>
                    </div>

                    <div class="aez-info-section">
                        <h4 class="aez-all-caps -blue">Awards Status</h4>
                        <p class="aez-info-text">
                            Non-member
                        </p>
                        <p>
                            Simply add a username and password to start earning now!
                        </p>
                        <button type="button" name="button" class="aez-btn aez-btn--outline-blue">Add Log-in Information</button>
                    </div>
                </div>
            </div> <!-- end aez-info-block-container -->
        </div>


        <div class="aez-confirm-btn">
            <button type="button" name="button" class="aez-btn aez-btn--filled-green">Confirm Reservation</button>
        </div>

        <div class="aez-extra aez-extra--confirmation">
            <div class="aez-extra-header">
                <h4>Helper Link</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="aez-extra-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </div>
            <div class="aez-extra-header">
                <h4>Location Rental Policy</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="aez-extra-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </div>
            <div class="aez-extra-header">
                <h4>Terms &amp; Conditions</h4>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </div>
            <div class="aez-extra-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </div>
        </div> <!-- ends aez-extra -->
    </main>
</div>
*/