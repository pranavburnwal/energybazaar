clc
close all
clear all
 
%%
% intensity

   Fs = 1;                      % samples per hour
   dt = 1/Fs;                   % hour per sample
   StopTime = 24;               % hours
   t = (0:dt:StopTime-dt)';     % hour
% Sine wave:
   Fc = 2*pi/24                 % hertz
   sun = 0.5+0.5*sin(Fc*t+10);

   
   battery_capacity_B = 0.5+0.5*cos(Fc*t+10)

%% Households generation agents

% A is the producer
household_a.power = 300;  % in Watt
household_a.production = 0;

% B is the storage
household_b.store_capacity = 0;
total_capacity = 350;

%%
n = 24;
A = []
B = []
hours = 1;

%%
% while household_a.capacity < 10 && household_b.store_capacity < 10 && index < 10

    while hours < n
        household_a.production = household_a.power*sun(hours); % in w/hour
        
        A(hours) = household_a.production;
        B(hours) = total_capacity*battery_capacity_B(hours);
      
        hours = hours + 1;
    end

    %%
transaction = min(A,B);
uint256_value = round(transaction)
% Call mintfunction to blockchain
% send transaction value to blockchain = value is amount of tokens actually
% used.
% 

% end

%% plot

figure(1)
hold on
plot(A)
plot(B)
plot(transaction)

 figure(2)
   stem(uint256_value);
   xlabel('time on hour basis');
   title('tradeable energy between A and B in Watt/hour');
  



%% 
% Plot the signal versus time:
   figure;
   plot(t,sun);
   xlabel('time (in hours)');
   title('Solar Radiation Intensity');
   zoom xon;

