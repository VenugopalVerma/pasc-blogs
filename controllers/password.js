const { User } = require("../models/user");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
// ===PASSWORD RECOVER AND RESET

// @route POST resetpassword/recover
// Recover Password - Generates token and Sends password reset email

exports.recover = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user)
        return res.status(401).json({
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again."
        });

      //Generate and set password reset token
      user.generateResetPasswordToken();
      // console.log("token genereted");

      // Save the updated user object
      user
        .save()
        .then(async user => {
          // send email
          
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD 
            }
          });

          let link =
            "http://" +
            req.headers.host +
            "/resetpassword/reset/" +
            user.resetPasswordToken;

          const mailOptions = {
            from: process.env.EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Password change request", // Subject line
            text: `Hi ${user.displayName} \n 
                    Please click on the following link ${link} to reset your password. \n\n 
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
            // html: "<b>Hello world?</b>" // html body
          };
          // send mail with defined transport object
          //   let info = await transporter.sendMail(mailOptions);

          // 
          
          transporter.sendMail(mailOptions, (error, result) => {
            console.log("mail error",user.email);
            if (error) return res.status(500).json({ message: error.message });
            console.log("mail sent");
            res.status(200).json({
              message:
                "A reset email has been sent to " +
                `${user.email}` +
                "."
            });
          });

          
        })
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

// @route get /resetpassword/reset
// Reset Password - Validate password reset token 
exports.reset = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(user => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Redirect user
      res.send(`send post request to http://localhost:3000/resetpassword/reset/${req.params.token} with body object 'password': 'New Password' `);
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

// @route POST api/auth/reset
// Reset Password
exports.resetPassword = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }).then(async user => {
    if (!user)
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has expired." });

    //Set the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password,salt);
    console.log('user password',user.password);
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save
    user.save(err => {
      if (err) return res.status(500).json({ message: err.message });

      // send email
      const mailOptions = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: "Your password has been changed",
        text: `Hi ${user.displayName} \n 
              This is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD 
        }
      });
      transporter.sendMail(mailOptions, (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        res.status(200).json({ message: "Your password has been updated." });
      });
    });
  });
};
