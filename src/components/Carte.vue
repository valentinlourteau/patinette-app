<template>
	<div>
		<div style="height:100%;position:fixed;">
			<GmapMap
			:center="{lat:10, lng:10}"
			:zoom="17"
			map-type-id="terrain"
			style="width: 500px; height: 100%"
			ref="trotinettesMapRef"
			:options="{
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: true,
				disableDefaultUi: false
			}"
			>
			<GmapMarker
			:key="index"
			v-for="(m, index) in markers"
			:position="m.position"
			:clickable="true"
			:draggable="true"
			@click="center=m.position"
			/>
		</GmapMap>
	</div>

	<!-- Bouton pour réserver un bolide -->
	<div class="text-xs-center">
		<v-btn
		round
		color="primary"
		large
		fixed
		style="left:50%;transform:translateX(-50%);bottom:36px;"
		dark
		v-if="currentLocation == null"
		@click="onClickPictureQRCode()">
		<span style="margin-right: 12px;">Scanner le bolide</span>
		<v-icon>photo_camera</v-icon>
	</v-btn>
</div>

<!-- Panel de location en cours pour notamment achever la location -->
<v-card
v-if="currentLocation != null"
style="position:fixed;bottom:36px;left:50%;transform: translateX(-50%);width: 80%;"
>

<v-card-title primary-title>
	<div>
		<h3 class="headline mb-0">Une location est en cours !</h3>
	</div>
</v-card-title>

<v-card-text>
	<div class="body-2">
		Temps écoulé depuis le début : 2:21
	</div>
	<div class="body-2">
		Coût estimé : 3€25
	</div>
</v-card-text>

<v-card-actions>
	<v-btn flat color="orange" @click="onClickEndLocation()">TERMINER LA LOCATION</v-btn>
</v-card-actions>

</v-card>


<qrcode-stream v-if="keepDecoding" :track="keepDecoding" @decode="onDecode"></qrcode-stream>

<v-layout row justify-center>
	<v-dialog
	v-model="dialogValidateTrottinette"
	max-width="500px"
	transition="dialog-transition"
	persistent
	>
	<v-card>
		<v-card-title>
			<span class="headline">Dernière étape !</span>
			<span class="subheading grey--text">On démarre le moteur électrique..</span>
		</v-card-title>
		<v-card-text>

			<span>Le tarif de la location d'une trottinette comporte un coût fixe de 1€ pour la location, puis 0.15€ par minute.
				<br/>Par exemple, un trajet de 15 minutes vous reviendra à 3€25. Veuillez consultez notre FAQ pour plus de renseignements sur les conditions d'utilisation du service.
			</span>

			<v-alert
			:value="true"
			type="warning"
			>
			Valider entrainera le début du minuteur et par conséquent le débit du moyen de payement précisé.
		</v-alert>

	</v-card-text>
	<v-card-actions>
		<v-spacer></v-spacer>
		<v-btn color="green darken-1" flat @click="dialogValidateTrottinette = false">ANNULER</v-btn>
		<v-btn color="green darken-1" flat @click="onClickValidateReservation()">VALIDER</v-btn>
	</v-card-actions>
</v-card>
</v-dialog>
</v-layout>

</div>
</template>

<script>
	export default {

		name: 'Carte',
		mounted() {
			this.$refs.trotinettesMapRef.$mapPromise.then((map) => {
				map.panTo({lat:48.854271, lng:2.387739})
			})
		},
		data () {
			return {
				keepDecoding: false,
				dialogValidateTrottinette: false,
				markers: [
				{position : {lat:48.854737, lng:2.387471}},
				{position : {lat:48.855092, lng:2.387163}},
				{position : {lat:48.855023, lng:2.386752}},
				{position : {lat:48.854186, lng:2.387772}},
				{position : {lat:48.854026, lng:2.387857}},
				],
				currentLocation: 'aa',
				selectedTrottinetteId: null,
			}
		},
		methods: {
			onClickPictureQRCode() {
				this.keepDecoding = !this.keepDecoding;
			},
			onDecode (decodedString) {
				console.log(decodedString);
				this.selectedTrottinetteId = decodedString;
				this.keepDecoding = false;
				this.dialogValidateTrottinette = true;
			},
			onClickValidateReservation() {
				//valider la location
				this.axios
				.post("trottinette/startLocation", {
					user: {
						login: this.$session.get('user')
					},
					trottinette: {
						id: this.selectedTrottinetteId
					}
				}).then(response => {
					if (response.status == 201) {
						console.log(response.body);
						this.currentLocation = response.body;
						this.dialogValidateTrottinette = false;
					}
				});
			},
			onClickEndLocation() {
				//terminer la location en cours
				this.currentLocation = null; 
			}
		}
	}
</script>

<style lang="css" scoped>
.qrcode-stream {
	position: fixed;
	top: 50%;
	transform: translateY(-50%);
	margin: 0 20px;
	border: 4px yellow solid;
}
</style>